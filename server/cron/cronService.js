const cron = require('node-cron');
const config = require('../config');
const TradingAnalyticsService = require('../services/tradingAnalyticsService');

class CronService {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
    this.tradingAnalytics = new TradingAnalyticsService();
  }

  /**
   * Start all cron jobs
   */
  start() {
    if (this.isRunning) {
      console.log('Cron service is already running');
      return;
    }

    console.log('Starting cron service...');
    this.isRunning = true;

    // Start the trading analytics job (every 30 seconds)
    this.addJob(
      'tradingAnalytics',
      '*/30 * * * * *',
      () => this.processData()
    );
    
    console.log('Cron service started successfully');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    if (!this.isRunning) {
      console.log('Cron service is not running');
      return;
    }

    console.log('Stopping cron service...');
    
    // Stop all jobs
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped cron job: ${name}`);
    });
    
    this.jobs.clear();
    this.isRunning = false;
    console.log('Cron service stopped');
  }


  /**
   * Process data - runs the trading analytics service
   */
  async processData() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Processing trading analytics...`);
      
      // Run the comprehensive trading analytics processing
      await this.tradingAnalytics.processTradingAnalytics();
      
      console.log(`[${timestamp}] Trading analytics processing completed successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in trading analytics processing:`, error);
      throw error;
    }
  }

  /**
   * Get status of all jobs
   */
  getStatus() {
    const status = {
      isRunning: this.isRunning,
      jobCount: this.jobs.size,
      jobs: []
    };

    this.jobs.forEach((job, name) => {
      status.jobs.push({
        name,
        running: job.running,
        scheduled: job.scheduled
      });
    });

    return status;
  }

  /**
   * Add a custom cron job
   */
  addJob(name, schedule, task, options = {}) {
    if (this.jobs.has(name)) {
      throw new Error(`Job with name '${name}' already exists`);
    }

    const job = cron.schedule(schedule, task, {
      scheduled: false,
      timezone: config.server.timezone || 'UTC',
      ...options
    });

    job.start();
    this.jobs.set(name, job);
    
    console.log(`Custom cron job '${name}' added and started`);
    return job;
  }

  /**
   * Remove a specific job
   */
  removeJob(name) {
    const job = this.jobs.get(name);
    if (!job) {
      throw new Error(`Job with name '${name}' not found`);
    }

    job.stop();
    this.jobs.delete(name);
    console.log(`Cron job '${name}' removed`);
  }
}

module.exports = CronService;
