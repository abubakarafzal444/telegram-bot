const axios = require("axios");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Replace 'nfts' with the name of your collection
const nftsRef = db.collection("nfts");

// Listen for changes to the nfts collection
nftsRef.onSnapshot(
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        console.log("modifiednft");
        // if soldAt field is added to the nft
        if (change.doc.data().soldAt) {
          const nft = change.doc.data();
          const {
            image,
            buyoutPricePerToken,
            name,
            listingId,
            tokenId,
            seller,
            buyer,
          } = nft;
          const botToken = "6154835043:AAEMt4hNxEwbix4bpGOcMN8xJvu3hGfF4DQ";
          const chatId = "-1001952993018";
          const message = `*NFT SOLD*\n${name} (#${tokenId})\nListing ID: ${listingId}\n🪪 [${seller?.slice(
            0,
            5
          )}...${seller?.slice(
            -4
          )}](https://evm.confluxscan.io/address/${seller}) to [${buyer?.slice(
            0,
            5
          )}...${buyer?.slice(
            -4
          )}](https://evm.confluxscan.io/address/${buyer})\n🪙 ${buyoutPricePerToken} CFX\nlightbot developed by nitfeemarket.xyz`;

          axios.post(`https://api.telegram.org/bot${botToken}/sendphoto`, {
            chat_id: chatId,
            caption: message,
            photo: image,
            parse_mode: "Markdown",
          });
        }
      }
    });
  },
  (error) => {
    console.error("Error getting snapshot:", error);
  }
);
