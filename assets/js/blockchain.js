let provider;

function initBlockchainProvider() {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(CONFIG.POLYGON_RPC);
  }
  return provider;
}

async function getTontineOnchain(contractAddress, abi) {
  initBlockchainProvider();
  const contract = new ethers.Contract(contractAddress, abi, provider);
  // Appel de la fonction totalContributions() selon l'ABI fournie
  try {
    const total = await contract.totalContributions();
    return { total_contributions_onchain: ethers.utils.formatEther(total) };
  } catch (e) {
    console.error('Blockchain read error', e);
    return null;
  }
}

function txLink(txHash) {
  return `${CONFIG.POLYGONSCAN_URL}/tx/${txHash}`;
}

function addressLink(address) {
  return `${CONFIG.POLYGONSCAN_URL}/address/${address}`;
}

function shortAddress(addr) {
  if (!addr) return '—';
  return `${addr.slice(0,6)}...${addr.slice(-4)}`;
}