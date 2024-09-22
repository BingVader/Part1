import React, { useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import IHiveData from "./IHive.json"; // Ensure this contains your ABI

const { abi } = IHiveData;

const deployedAddresses = {
  address: "0x14AA6b528a0080fEeFB6895de2DC23fC88F6D33C" // Replace with your actual contract address
};

function App() {
  const [ideaTitle, setIdeaTitle] = useState(""); // New state for idea title
  const [ideaDescription, setIdeaDescription] = useState("");
  const [status, setStatus] = useState("");
  const [retrievedIdea, setRetrievedIdea] = useState(""); 
  const [ideaID, setIdeaID] = useState(""); // State to hold the idea ID for retrieval

  // Initialize provider inside the function
  const provider = new BrowserProvider(window.ethereum);

  const connectMetaMask = async () => {
    try {
      const signer = await provider.getSigner();
      alert(`Successfully Connected: ${await signer.getAddress()}`);
    } catch (error) {
      console.error("MetaMask connection error:", error);
    }
  };

  async function submitIdea() {
    try {
      const signer = await provider.getSigner();
      const ihiveContract = new Contract(deployedAddresses.address, abi, signer);
      
      const tx = await ihiveContract.submitIdea(ideaTitle, ideaDescription, {
        gasLimit: 500000 // Adjust as needed
      });
      
      const receipt = await tx.wait(); // Wait for the transaction to be mined
  
      // Access the emitted event to get the ideaID
      const ideaID = receipt.events[0].args.ideaID.toString(); // Ensure this is correct
      console.log("Idea submitted successfully with ID:", ideaID);
      setStatus(`Idea submitted successfully! ID: ${ideaID}`);
      setIdeaID(ideaID); // Update the ideaID state
    } catch (error) {
      console.error("Error submitting idea:", error);
      setStatus("Error submitting idea. Check console for details.");
    }
  }
  
  const retrieveIdea = async (id) => {
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(deployedAddresses.address, abi, signer);
  
      // Convert the ID to a number before passing it to the contract
      const idea = await contract.getIdeaByID(parseInt(id)); // Ensure id is a number
      console.log("Retrieved Idea:", idea);
      
      setRetrievedIdea(`Description: ${idea[0]}, Submitted By: ${idea[2]}, Timestamp: ${idea[1]}`); // Format retrieved idea
      setStatus("Idea retrieved successfully!");
    } catch (error) {
      console.error("Error retrieving idea:", error);
      setStatus("Error retrieving idea. Check console for details.");
    }
  };
  

  


  return (
    <div>
      <h1>IHive Idea Submission</h1>
      
      <input
        type="text"
        value={ideaTitle} // Input for the idea title
        onChange={(e) => setIdeaTitle(e.target.value)}
        placeholder="Enter your idea title"
      />
      <br /><br />

      <input
        type="text"
        value={ideaDescription} // Input for the idea description
        onChange={(e) => setIdeaDescription(e.target.value)}
        placeholder="Enter your idea description"
      />

      <br /><br />

      <button onClick={submitIdea}>Submit Idea</button>

      {status && <p>{status}</p>}
      {ideaID && <p>Your Idea ID is: {ideaID}</p>}


      <h2>Retrieve Idea</h2>
      <input
        type="text"
        placeholder="Enter idea ID"
        onChange={(e) => setIdeaID(e.target.value)} // Store idea ID for retrieval
      />
      <button onClick={() => retrieveIdea(ideaID)}>Retrieve Idea</button>
      {retrievedIdea && (
        <div>
          <h3>Retrieved Idea:</h3>
          <p>{retrievedIdea}</p>
        </div>
      )}
    </div>
  );
}

export default App;
