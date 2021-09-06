import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import {
    getLedgerWallet,
    getPhantomWallet,
    getSolflareWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets'
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import * as web3 from '@solana/web3.js'
import  * as splToken from '@solana/spl-token';
import React, { FC, useCallback } from 'react';


export const CreateNFT= () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

       	// Create Mint account keypair
			const mintAccount = web3.Keypair.generate();

			// Token ID on testnet
			const tokenProgramId = new web3.PublicKey(
				"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			);

			// Needed balance for mintAccount to be RentExempt
			const balanceNeeded = await splToken.Token.getMinBalanceRentForExemptMint(
				connection
			);

            let mint = await splToken.Token.createMint(
                connection,
                publicKey,
                mintAccount.publicKey,
                mintAccount.publicKey,
                1,
                tokenProgramId
            )

            let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
                mintAccount.publicKey
            )

            let toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
                publicKey
            )

            await mint.mintTo(
                fromTokenAccount.address,
                mintAccount.publicKey,
                [],
                1000000000,


            );

            var transaction = new web3.Transaction().add(
                splToken.Token.createTransferInstruction(
                    tokenProgramId,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    mintAccount.publicKey,
                    [],
                    1
                )
            )

            var signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [mintAccount],
                {commitment:'confirmed'}

            );
            console.log('SIGNATURE', signature)
    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={onClick} onError = {()=>{console.log('error')}}>
            mint your NFT
        </button>
    );
};