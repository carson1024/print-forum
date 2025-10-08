const express = require('express');
const WalletService = require('./walletService');

const router = express.Router();
const walletService = new WalletService();

// Middleware to validate user ID
const validateUserId = (req, res, next) => {
  const userId = req.body.userId || req.params.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }
  req.userId = userId;
  next();
};

/**
 * @route POST /api/wallet/create
 * @desc Create a new wallet (single wallet per user)
 */
router.post('/create', validateUserId, async (req, res) => {
  try {
    const { walletName } = req.body;
    const { publicKey, privateKey } = walletService.generateWallet();
    
    const saveResult = await walletService.saveWallet(
      req.userId, 
      publicKey, 
      privateKey, 
      walletName
    );

    if (saveResult.success) {
      res.status(201).json({
        success: true,
        wallet: {
          id: saveResult.data.id,
          public_key: publicKey,
          wallet_name: walletName || 'Copy Trading Wallet',
          created_at: saveResult.data.created_at
        },
        message: 'Wallet created successfully'
      });
    } else {
      res.status(400).json(saveResult);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/wallet/signup
 * @desc Create wallet for new user signup
 */
router.post('/signup', validateUserId, async (req, res) => {
  try {
    const result = await walletService.createWalletForSignup(req.userId);

    if (result.success) {
      res.status(201).json({
        success: true,
        wallet: result.wallet,
        message: result.message
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/wallet/import
 * @desc Import an existing wallet
 */
router.post('/import', validateUserId, async (req, res) => {
  try {
    const { privateKey, walletName } = req.body;
    
    if (!privateKey || !Array.isArray(privateKey)) {
      return res.status(400).json({
        success: false,
        error: 'Valid private key array is required'
      });
    }

    const { publicKey, privateKey: importedPrivateKey } = walletService.importWallet(privateKey);
    
    const saveResult = await walletService.saveWallet(
      req.userId, 
      publicKey, 
      importedPrivateKey, 
      walletName
    );

    if (saveResult.success) {
      res.status(201).json({
        success: true,
        wallet: {
          id: saveResult.data.id,
          public_key: publicKey,
          wallet_name: walletName || 'Imported Wallet',
          created_at: saveResult.data.created_at
        },
        message: 'Wallet imported successfully'
      });
    } else {
      res.status(500).json(saveResult);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import wallet',
      message: error.message
    });
  }
});

/**
 * @route GET /api/wallet/user/:userId
 * @desc Get user's single wallet
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { includeBalance } = req.query;
    
    let result;
    if (includeBalance === 'true') {
      const walletResult = await walletService.getUserWallet(req.params.userId);
      if (walletResult.success && walletResult.wallet) {
        const balance = await walletService.getWalletBalance(walletResult.wallet.public_key);
        result = {
          success: true,
          wallet: { ...walletResult.wallet, balance }
        };
      } else {
        result = walletResult;
      }
    } else {
      result = await walletService.getUserWallet(req.params.userId);
    }

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/wallet/:walletId
 * @desc Get specific wallet
 */
router.get('/:walletId', validateUserId, async (req, res) => {
  try {
    const { includeBalance } = req.query;
    
    let result;
    if (includeBalance === 'true') {
      result = await walletService.getWalletWithBalance(req.params.walletId, req.userId);
    } else {
      result = await walletService.getWalletById(req.params.walletId, req.userId);
    }

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/wallet/:walletId/balance
 * @desc Get wallet balance
 */
router.get('/:walletId/balance', validateUserId, async (req, res) => {
  try {
    const walletResult = await walletService.getWalletById(req.params.walletId, req.userId);
    if (!walletResult.success) {
      return res.status(404).json(walletResult);
    }

    const balance = await walletService.getWalletBalance(walletResult.wallet.public_key);
    
    res.json({
      success: true,
      balance: balance,
      public_key: walletResult.wallet.public_key
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get balance',
      message: error.message
    });
  }
});

/**
 * @route GET /api/wallet/:walletId/transactions
 * @desc Get wallet transaction history
 */
router.get('/:walletId/transactions', validateUserId, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const walletResult = await walletService.getWalletById(req.params.walletId, req.userId);
    if (!walletResult.success) {
      return res.status(404).json(walletResult);
    }

    const result = await walletService.getWalletTransactions(
      walletResult.wallet.public_key, 
      parseInt(limit)
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/wallet/:walletId/name
 * @desc Update wallet name
 */
router.put('/:walletId/name', validateUserId, async (req, res) => {
  try {
    const { walletName } = req.body;
    
    if (!walletName || walletName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Wallet name is required'
      });
    }

    const result = await walletService.updateWalletName(
      req.params.walletId, 
      req.userId, 
      walletName.trim()
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Wallet name updated successfully'
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update wallet name',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/wallet/:walletId
 * @desc Deactivate wallet
 */
router.delete('/:walletId', validateUserId, async (req, res) => {
  try {
    const result = await walletService.deactivateWallet(req.params.walletId, req.userId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Wallet deactivated successfully'
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate wallet',
      message: error.message
    });
  }
});

/**
 * @route POST /api/wallet/validate-address
 * @desc Validate Solana address
 */
router.post('/validate-address', (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const isValid = walletService.isValidSolanaAddress(address);
    
    res.json({
      success: true,
      isValid,
      address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to validate address',
      message: error.message
    });
  }
});

/**
 * @route GET /api/wallet/health
 * @desc Health check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wallet service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
