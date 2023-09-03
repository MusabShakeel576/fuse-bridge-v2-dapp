import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cross from "../../assets/cross.svg";
import Transaction from "./Transaction";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchBridgeTransactions,
  selectTransactionsSlice,
} from "../../store/transactionsSlice";
import { useConnectWallet } from "@web3-onboard/react";

interface TransactionProps {
  delegators?: Array<Array<string>> | undefined;
  isOpen: boolean;
  onToggle: (arg: boolean) => void;
  isLoading?: boolean;
}

const Transactions = ({
  isOpen,
  onToggle,
  isLoading = false,
}: TransactionProps): JSX.Element => {
  const [{ wallet }] = useConnectWallet();
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        onToggle(false);
      }
    });
  }, [onToggle]);
  const transactionsSlice = useAppSelector(selectTransactionsSlice);
  useEffect(() => {
    if (wallet?.accounts[0].address && isOpen) {
      dispatch(fetchBridgeTransactions(wallet?.accounts[0].address));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.accounts[0].address, isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, right: "-100%" }}
            animate={{ opacity: 1, right: "0%" }}
            exit={{ opacity: 0, right: "-100%" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white h-screen w-[50%] right-0 absolute p-6 flex flex-col items-start overflow-y-auto z-50"
          >
            <img
              src={cross}
              alt="cross"
              className="h-10 bg-modal-bg p-1 rounded-md cursor-pointer"
              onClick={() => {
                onToggle(false);
              }}
            />
            <span className="text-2xl font-semibold mt-4 mb-2">
              Transactions History
            </span>
            {transactionsSlice.transactions.map((transaction, i) => {
              return (
                <Transaction
                  transaction={transaction}
                  transactionHashes={transactionsSlice.transactionHashes[i]}
                  key={i}
                />
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Transactions;
