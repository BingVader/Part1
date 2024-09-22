// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IHive {
    struct Idea {
        address submitter;
        string ideaDescription;
        uint timestamp;
        uint ideaID;  // Unique 5-digit identifier for the idea
    }

    Idea[] public ideas;
    mapping(string => bool) public ideaExists; // Check if idea already exists
    mapping(uint => Idea) public ideasByID; // Store ideas by their unique ID

    uint private nextID = 10000; // Starting the unique ID from 10000 (5-digit)

    event IdeaSubmitted(address indexed submitter, string ideaDescription, uint timestamp, uint ideaID);
    event IdeaSimilar(address indexed submitter, string ideaDescription, uint timestamp);

    // Function to submit an idea with a title and description
    function submitIdea(string memory ideaTitle, string memory ideaDescription) public returns (uint) {
        require(bytes(ideaTitle).length > 0, "Idea title cannot be empty");
        require(bytes(ideaDescription).length > 0, "Idea description cannot be empty");

        // Check if the idea title already exists
        if (ideaExists[ideaTitle]) {
            emit IdeaSimilar(msg.sender, ideaTitle, block.timestamp);
            return 0;  // Return 0 to indicate that the idea already exists
        } else {
            // Generate a new unique 5-digit ID
            uint ideaID = nextID;
            nextID++;  // Increment the ID for the next submission

            // Add the new idea to storage
            Idea memory newIdea = Idea(msg.sender, ideaDescription, block.timestamp, ideaID);
            ideas.push(newIdea);
            ideasByID[ideaID] = newIdea; // Store the idea by its unique ID
            ideaExists[ideaTitle] = true;

            emit IdeaSubmitted(msg.sender, ideaDescription, block.timestamp, ideaID);
            return ideaID;  // Return the unique ID
        }
    }

    // Function to retrieve an idea by its unique ID
    function getIdeaByID(uint ideaID) public view returns (string memory, uint, address) {
        require(ideasByID[ideaID].ideaID == ideaID, "Idea ID does not exist");
        Idea memory idea = ideasByID[ideaID];
        return (idea.ideaDescription, idea.timestamp, idea.submitter);
    }

    // Function to get the total number of ideas
    function getIdeaCount() public view returns (uint) {
        return ideas.length;
    }
}