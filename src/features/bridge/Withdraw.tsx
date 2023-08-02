import React, { useEffect, useState } from "react";
import {
  chainConfig,
  exchangeConfig,
  coinConfig,
  appConfig,
} from "../../constants/config";
import Dropdown from "../commons/Dropdown";
import switchImg from "../../assets/switch.svg";
import { useSetChain, useConnectWallet } from "@web3-onboard/react";
import { getERC20Balance } from "../../utils/erc20";
import { selectBalanceSlice, fetchBalance } from "../../store/balanceSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectChainSlice, setChain } from "../../store/chainSlice";

type WithdrawProps = {
  selectedChainSection: number;
  selectedChainItem: number;
  setSelectedChainSection: (section: number) => void;
  setSelectedChainItem: (item: number) => void;
  selectedTokenSection: number;
  selectedTokenItem: number;
  setSelectedTokenSection: (section: number) => void;
  setSelectedTokenItem: (item: number) => void;
  onSwitch: (
    tokenSection: number,
    tokenItem: number,
    chainSection: number,
    chainItem: number
  ) => void;
  amount: string;
  setAmount: (amount: string) => void;
};

const Withdraw = ({
  selectedChainSection,
  selectedChainItem,
  setSelectedChainSection,
  setSelectedChainItem,
  selectedTokenSection,
  selectedTokenItem,
  setSelectedTokenSection,
  setSelectedTokenItem,
  onSwitch,
  amount,
  setAmount,
}: WithdrawProps) => {
  const [{ chains }] = useSetChain();
  const [{ wallet }] = useConnectWallet();
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const chainSlice = useAppSelector(selectChainSlice);
  useEffect(() => {
    if (wallet)
      dispatch(
        fetchBalance({
          address: wallet.accounts[0].address,
          contractAddress:
            appConfig.wrappedBridge.wrapped.tokens[selectedTokenItem].address,
          decimals:
            appConfig.wrappedBridge.wrapped.tokens[selectedTokenItem].decimals,
          bridge: appConfig.wrappedBridge.wrapped.address,
        })
      );
  }, [
    selectedTokenItem,
    selectedTokenSection,
    wallet?.accounts[0].address,
    chainSlice.chainId,
  ]);
  useEffect(() => {
    if (chainSlice.chainId === 0) {
      dispatch(
        setChain({
          chainId: 122,
          bridge: appConfig.wrappedBridge.wrapped.address,
          icon: chains[0].icon as string,
          lzChainId: 138,
          name: "Fuse",
          rpcUrl: "https://rpc.fuse.io",
          tokens: [],
        })
      );
    }
  }, [chainSlice.chainId]);
  return (
    <>
      <div className="flex bg-modal-bg rounded-md p-4 mt-3 w-full flex-col">
        <span className="font-semibold text-lg">From Fuse Network</span>
        <div className="flex w-full items-center mt-3">
          <div className="bg-white w-2/3 p-4 rounded-s-md border-[1px] border-border-gray">
            <input
              type="text"
              className="w-full bg-transparent focus:outline-none"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <Dropdown
            items={[
              {
                heading: "Tokens",
                items: appConfig.wrappedBridge.chains[
                  selectedChainItem
                ].tokens.map((coin, i) => {
                  return {
                    icon: coin.icon,
                    id: i,
                    item: coin.symbol,
                  };
                }),
              },
            ]}
            selectedSection={selectedTokenSection}
            selectedItem={selectedTokenItem}
            className="rounded-e-md rounded-s-none border-s-0 w-1/3"
            onClick={(section, item) => {
              setSelectedTokenSection(section);
              setSelectedTokenItem(item);
            }}
          />
        </div>
        <span className="mt-3 text-sm font-medium">
          Balance:{" "}
          {balanceSlice.isBalanceLoading ? (
            <span className="px-10 py-1 ml-2 rounded-md animate-pulse bg-fuse-black/10"></span>
          ) : (
            balanceSlice.balance
          )}
        </span>
      </div>
      <div className="flex justify-center">
        <img
          src={switchImg}
          alt="switch"
          className="mt-4 cursor-pointer"
          onClick={() => {
            onSwitch(
              selectedTokenSection,
              selectedTokenItem,
              selectedChainSection,
              selectedChainItem
            );
            dispatch(
              setChain(appConfig.wrappedBridge.chains[selectedChainItem])
            );
          }}
        />
      </div>
      <div className="flex bg-modal-bg rounded-md px-4 py-6 mt-3 w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <span className="font-medium mr-[10px]">To</span>
          <Dropdown
            items={[
              {
                heading: "Chains",
                items: appConfig.wrappedBridge.chains.map((chain) => {
                  return {
                    item: chain.name,
                    icon: chain.icon,
                    id: chain.lzChainId,
                  };
                }),
              },
              //   {
              //     heading: "Centralized Exchanges",
              //     items: exchangeConfig.exchanges.map((exchange, i) => {
              //       return {
              //         item: exchange.name,
              //         icon: exchange.icon,
              //         id: i,
              //       };
              //     }),
              //   },
            ]}
            selectedSection={selectedChainSection}
            selectedItem={selectedChainItem}
            className="w-9/10"
            onClick={(section, item) => {
              setSelectedChainSection(section);
              setSelectedChainItem(item);
            }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <span className="text-black/50 font-medium">You will receive</span>
        <span className="font-medium">
          {amount ? amount : 0} <span className="font-bold">USDC</span>
        </span>
      </div>
    </>
  );
};

export default Withdraw;
