import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowDown } from "react-icons/im";
import { useAuth } from "contexts/AuthContext";
import React, { useState } from "react";
import { showToastr } from "components/toastr";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

const ConfirmwithdrawModal = ({
  isOpen,
  onClose,
  maxsol,
  withdraw,
  privateKey,
  to
}: Readonly<{
  isOpen: boolean,
  maxsol: number,
  withdraw: number,
  privateKey: any,
  to: string,
  onClose: () => void
}>) => {
  const [isLoading, setIsLoading] = useState(false);
  // Setup connection to the network
  const connection = new Connection('https://api.devnet.solana.com'); // or use  for testing  'https://api.mainnet-beta.solana.com'

  // Load sender's private key (make sure you load it securely!)
  const sender = privateKey;
  const handlewithdraw = async () => {
    setIsLoading(true);
    const receiverPublicKey = new PublicKey(to);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: receiverPublicKey,
        lamports: withdraw * LAMPORTS_PER_SOL, // for example, send 0.01 SOL
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
    console.log('Transaction signature', signature);
    setIsLoading(false);
    onClose();
    showToastr("Withdraw Successfully!", "success");
  }

  return <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-6">
      <div className="flex">
        <div className="btn btn-sm btn-red flex items-center gap-1">
          <ImArrowDown size={12} />
          <span className="">Confirm Withdraw funds</span>
        </div>
      </div>

      <p className="text-white text-xs sm:text-sm !leading-[135%]">
        Do you really withdraw {withdraw} SOL from your account?<br />
        withdraw funds : {withdraw} SOL<br />
        remaining funds : {(Number(maxsol) || 0) - (Number(withdraw) || 0)} SOL<br />
      </p>


      {/* Withdraw Button */}
      <button className="w-full btn text-sm sm:text-base py-3" onClick={handlewithdraw}>Withdraw</button>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : null}
    </div>
  </Modal>
}

export default ConfirmwithdrawModal;