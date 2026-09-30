const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  dbName: process.env.MONGODB_DATABASE || 'shopDB'
};

const connectDatabase = async () => {
  const configuredDnsServers = process.env.MONGODB_DNS_SERVERS;
  if (configuredDnsServers !== undefined) {
    const dnsServers = configuredDnsServers
      .split(',')
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers.length === 0) {
      throw new Error('MONGODB_DNS_SERVERS must contain at least one DNS server');
    }

    dns.setServers(dnsServers);
  }

  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_FALLBACK_URI;

  if (!primaryUri) {
    throw new Error('MONGODB_URI is missing from backend/.env');
  }

  try {
    await mongoose.connect(primaryUri, connectionOptions);
    console.log('Connected to primary MongoDB database (Atlas).');
    return 'atlas';
  } catch (primaryError) {
    if (!fallbackUri) {
      throw primaryError;
    }

    console.error(`Primary MongoDB connection failed: ${primaryError.message}`);
    console.warn('Trying the configured fallback MongoDB database.');
    await mongoose.disconnect();

    try {
      await mongoose.connect(fallbackUri, connectionOptions);
      console.warn(
        'Connected to fallback MongoDB. Changes made here are not synchronized with Atlas.'
      );
      return 'fallback';
    } catch (fallbackError) {
      throw new Error(
        `Could not connect to Atlas or fallback MongoDB. Atlas: ${primaryError.message}; fallback: ${fallbackError.message}`
      );
    }
  }
};

module.exports = { connectDatabase };
