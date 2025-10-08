const { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createClient } = require('@supabase/supabase-js');
const CryptoJS = require('crypto-js');
const config = require('../config');

// Initialize Supabase client
const supabase = createClient(
  config.database.url,
  config.database.serviceRoleKey
);

class WalletService {
  constructor() {
    this.encryptionKey = config.wallet.encryptionKey;
    this.connection = new Connection(
      config.solana.rpcUrl,
      config.solana.commitment
    );
    this.defaultWalletName = config.wallet.defaultWalletName;
    this.maxWalletsPerUser = config.wallet.maxWalletsPerUser;
  }

  /**
   * Generate a new Solana wallet keypair
   */
  generateWallet() {
    try {
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();
      const privateKey = Array.from(keypair.secretKey);
      
      return {
        publicKey,
        privateKey,
        keypair
      };
    } catch (error) {
      throw new Error(`Failed to generate wallet: ${error.message}`);
    }
  }

  /**
   * Import wallet from private key
   */
  importWallet(privateKeyArray) {
    try {
      const secretKey = Uint8Array.from(privateKeyArray);
      const keypair = Keypair.fromSecretKey(secretKey);
      const publicKey = keypair.publicKey.toString();
      
      return {
        publicKey,
        privateKey: privateKeyArray,
        keypair
      };
    } catch (error) {
      throw new Error(`Failed to import wallet: ${error.message}`);
    }
  }

  /**
   * Encrypt private key using AES
   */
  encryptPrivateKey(privateKey) {
    try {
      const privateKeyString = JSON.stringify(privateKey);
      const encrypted = CryptoJS.AES.encrypt(privateKeyString, this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt private key: ${error.message}`);
    }
  }

  /**
   * Decrypt private key using AES
   */
  decryptPrivateKey(encryptedPrivateKey) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedPrivateKey, this.encryptionKey);
      const privateKeyString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(privateKeyString);
    } catch (error) {
      throw new Error(`Failed to decrypt private key: ${error.message}`);
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(publicKey) {
    try {
      const pubKey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      throw new Error(`Failed to get wallet balance: ${error.message}`);
    }
  }

  /**
   * Save wallet to database (single wallet per user)
   */
  async saveWallet(userId, publicKey, privateKey, walletName = null) {
    const finalWalletName = walletName || this.defaultWalletName;
    try {
      // Check if user already has a wallet
      const { data: existingWallet, error: checkError } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw checkError;
      }

      if (existingWallet) {
        return { 
          success: false, 
          error: 'User already has a wallet. Only one wallet per user is allowed.' 
        };
      }

      const encryptedPrivateKey = this.encryptPrivateKey(privateKey);
      
      const { data, error } = await supabase
        .from('wallets')
        .insert([{
          user_id: userId,
          public_key: publicKey,
          private_key_encoded: encryptedPrivateKey,
          wallet_name: finalWalletName,
          is_active: true
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's single wallet
   */
  async getUserWallet(userId) {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('id, public_key, wallet_name, created_at, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return { success: true, wallet: null };
        }
        throw error;
      }
      return { success: true, wallet: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's wallets (for backward compatibility)
   */
  async getUserWallets(userId) {
    const result = await this.getUserWallet(userId);
    if (result.success) {
      return { success: true, wallets: result.wallet ? [result.wallet] : [] };
    }
    return result;
  }

  /**
   * Create wallet for new user signup
   */
  async createWalletForSignup(userId) {
    try {
      // Check if user already has a wallet
      const existingWallet = await this.getUserWallet(userId);
      if (existingWallet.success && existingWallet.wallet) {
        return {
          success: true,
          wallet: existingWallet.wallet,
          message: 'User already has a wallet'
        };
      }

      // Generate new wallet
      const { publicKey, privateKey } = this.generateWallet();
      
      // Save wallet
      const saveResult = await this.saveWallet(userId, publicKey, privateKey);
      
      if (saveResult.success) {
        return {
          success: true,
          wallet: {
            id: saveResult.data.id,
            public_key: publicKey,
            wallet_name: saveResult.data.wallet_name,
            created_at: saveResult.data.created_at,
            is_active: true
          },
          message: 'Wallet created successfully for new user'
        };
      } else {
        return saveResult;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get wallet by ID
   */
  async getWalletById(walletId, userId) {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { success: true, wallet: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get wallet private key (decrypted)
   */
  async getWalletPrivateKey(walletId, userId) {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('private_key_encoded')
        .eq('id', walletId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      const privateKey = this.decryptPrivateKey(data.private_key_encoded);
      return { success: true, privateKey };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update wallet name
   */
  async updateWalletName(walletId, userId, newName) {
    try {
      const { error } = await supabase
        .from('wallets')
        .update({ wallet_name: newName })
        .eq('id', walletId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Deactivate wallet
   */
  async deactivateWallet(walletId, userId) {
    try {
      const { error } = await supabase
        .from('wallets')
        .update({ 
          is_active: false, 
          deactivated_at: new Date().toISOString() 
        })
        .eq('id', walletId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get wallet with balance
   */
  async getWalletWithBalance(walletId, userId) {
    try {
      const walletResult = await this.getWalletById(walletId, userId);
      if (!walletResult.success) return walletResult;

      const balance = await this.getWalletBalance(walletResult.wallet.public_key);
      
      return {
        success: true,
        wallet: {
          ...walletResult.wallet,
          balance: balance
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all user wallets with balances
   */
  async getUserWalletsWithBalances(userId) {
    try {
      const walletsResult = await this.getUserWallets(userId);
      if (!walletsResult.success) return walletsResult;

      const walletsWithBalances = await Promise.all(
        walletsResult.wallets.map(async (wallet) => {
          try {
            const balance = await this.getWalletBalance(wallet.public_key);
            return { ...wallet, balance };
          } catch (error) {
            return { ...wallet, balance: 0 };
          }
        })
      );

      return { success: true, wallets: walletsWithBalances };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate Solana address
   */
  isValidSolanaAddress(address) {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get wallet transaction history (basic implementation)
   */
  async getWalletTransactions(publicKey, limit = 10) {
    try {
      const pubKey = new PublicKey(publicKey);
      const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await this.connection.getTransaction(sig.signature);
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              confirmationStatus: sig.confirmationStatus,
              err: sig.err,
              memo: sig.memo,
              transaction: tx
            };
          } catch (error) {
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              confirmationStatus: sig.confirmationStatus,
              err: sig.err,
              memo: sig.memo,
              error: error.message
            };
          }
        })
      );

      return { success: true, transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = WalletService;
