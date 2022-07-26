import contract from "@truffle/contract";

export const loadcontract= async(contractName, provider)=>{
    const res = await fetch(`/contracts/${contractName}.json`);
    const Artifacts=await res.json();
    const _contract=contract(Artifacts);
    _contract.setProvider(provider);
    const deployedContract=await _contract.deployed();
    return deployedContract;
}