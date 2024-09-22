import IHiveData from "./IHive.json"; // Ensure this contains your ABI
const { abi } = IHiveData;
const { ethers } = require("ethers");
const contractABI = abi;
const contractAddress = "0x62d24299c017B42e478ca3e51DB35f3C0011fD1C";


// Connect to Ethereum
async function submitIdea(ideaDescription) {
    if (typeof window.ethereum !== "undefined") {
        // Connect to MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Connect to the IHive contract
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Submit idea
        try {
            const tx = await contract.submitIdea(ideaDescription);
            await tx.wait();
            console.log("Idea submitted successfully:", ideaDescription);
        } catch (error) {
            console.error("Error submitting idea:", error);
        }
    } else {
        console.error("MetaMask is not installed!");
    }
}
