import React, { useEffect, useState } from "react";
import { Contract, parseEther, BrowserProvider } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, usePublicClient, useWalletClient} from 'wagmi';
import abi from "../utils/BuyMeToken.json";
import {
  ChevronDown,
  Copy,
  RefreshCw,
  Send,
  ArrowDown,
  UserCircle,
} from "lucide-react";

export default function Home() {
  const contractAddress = "0xB72E17d82F505976569F6E513D5a60E9fa35a417";
  const contractABI = abi.abi;

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  interface Memo {
    address: string;
    timestamp: Date;
    message: string;
    name: string;
  }
  const [activeSection, setActiveSection] = useState("send");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(false);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

   // Get ethers provider and signer
   const getEthersProvider = () => {
    if (!publicClient) return null;
    return new BrowserProvider(publicClient.transport);
  };

  const getSigner = async () => {
    if (!walletClient) return null;
    return new BrowserProvider(walletClient.transport).getSigner();
  };

  const buyToken = async () => {
    try {
      const signer = await getSigner();
      if (!signer) {
        console.log("No signer available");
        return;
      }
      setLoading(true);
      const buyMeToken = new Contract(contractAddress, contractABI, signer);

      const tokenTxn = await buyMeToken.buyToken(
        name ? name : "anon",
        message ? message : "Enjoy your token!",
        { value: parseEther("0.001") }
      );

      await tokenTxn.wait();
      setName("");
      setMessage("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMemos = async () => {
    try {
      const provider = publicClient;
      if (!provider) return;
      setLoading(true);
      const ethersProvider = new BrowserProvider(provider.transport);
      const buyMeToken = new Contract(contractAddress, contractABI, ethersProvider);
      const memos = await buyMeToken.getMemos();
      
      const formattedMemos = memos.map((memo: any) => ({
        address: memo.from,
        timestamp: new Date(Number(memo.timestamp) * 1000),
        message: memo.message,
        name: memo.name,
      }));
      
      formattedMemos.sort((a: Memo, b: Memo) => b.timestamp.getTime() - a.timestamp.getTime());
      setMemos(formattedMemos);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const reloadMemos = async () => {
    await getMemos();
  };

  useEffect(() => {
    let buyMeToken: Contract;
    let provider: BrowserProvider | null = null;
    getMemos();

    if (provider) {
      buyMeToken = new Contract(contractAddress, contractABI, provider);

      const onNewMemo = (
        from: string,
        timestamp: BigInt,
        name: string,
        message: string
      ) => {
        const timestampInMs = Number(timestamp) * 1000;
        const newMemo = {
          address: from,
          timestamp: new Date(timestampInMs),
          message,
          name,
        };
        setMemos((prevState) => [newMemo, ...prevState]);
      };

      buyMeToken.on("NewMemo", onNewMemo);

      return () => {
        if (buyMeToken) {
          buyMeToken.off("NewMemo", onNewMemo);
        }
      };
    }
  }, [publicClient]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="col-span-3 bg-[#1A1A1A] rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">iShinzoo</h2>
            <UserCircle className="text-gray-500" />
          </div>

          <div className="space-y-2">
            {["send", "memos"].map((section) => (
              <motion.button
                key={section}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section)}
                className={`w-full py-3 rounded-lg text-left px-4 capitalize ${
                  activeSection === section
                    ? "bg-[#2C2F36] text-white"
                    : "text-gray-500 hover:bg-[#2C2F36]/50"
                }`}
              >
                {section}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="col-span-6 bg-[#1A1A1A] rounded-2xl p-6"
        >
          {!address ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <ConnectButton 
                showBalance={true}
                accountStatus="address"
                chainStatus="icon"
              />
            </div>
          ) : (
            <>
              {activeSection === "send" && (
                <div className="space-y-6">
                  <div className="bg-[#2C2F36] rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={onNameChange}
                        className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none"
                      />
                      <UserCircle className="text-gray-500" />
                    </div>
                  </div>

                  <div className="bg-[#2C2F36] rounded-xl p-4 space-y-4">
                    <textarea
                      placeholder="Write your message"
                      value={message}
                      onChange={onMessageChange}
                      rows={3}
                      className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={buyToken}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl text-white font-bold"
                  >
                    {loading ? "Processing..." : "Send Token"}
                  </motion.button>
                </div>
              )}

              {activeSection === "memos" && (
                <div className="space-y-4 h-[500px] overflow-y-auto" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4A5568 #2C2F36',
                }}>
                  <style>
                    {`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                      }

                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: #2C2F36;
                        border-radius: 4px;
                      }

                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #4A5568;
                        border-radius: 4px;
                      }

                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #718096;
                      }
                    `}
                  </style>
                  <div className="h-full pr-2 custom-scrollbar">
                    {memos.map((memo, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#2C2F36] rounded-xl p-4 mb-4"
                      >
                        <p className="text-white">{memo.message}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          From: {memo.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Right Sidebar - Recent Activity */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="col-span-3 bg-[#1A1A1A] rounded-2xl p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <motion.button
              whileHover={{ rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              onClick={reloadMemos}
              className="text-gray-500 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {memos.slice(0, 3).map((memo, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{memo.name}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {memo.message}
                  </p>
                </div>
                <Send className="text-green-500 w-4 h-4" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}