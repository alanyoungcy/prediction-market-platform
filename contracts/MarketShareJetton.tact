import "@stdlib/deploy";
import "@stdlib/ownable";

message Mint {
    to: Address;
    amount: Int;
}

message Burn {
    amount: Int;
}

message Transfer {
    to: Address;
    amount: Int;
}

contract MarketShareJetton {
    owner: Address;
    marketId: Int;
    outcome: Bool; // true for YES, false for NO
    totalSupply: Int;
    balances: map<Address, Int>;
    
    init(owner: Address, marketId: Int, outcome: Bool) {
        self.owner = owner;
        self.marketId = marketId;
        self.outcome = outcome;
        self.totalSupply = 0;
    }
    
    receive(msg: Mint) {
        require(sender() == self.owner, "Only owner can mint tokens");
        
        let to = msg.to;
        let amount = msg.amount;
        
        let currentBalance = self.balances.get(to) ?? 0;
        self.balances.set(to, currentBalance + amount);
        self.totalSupply = self.totalSupply + amount;
    }
    
    receive(msg: Burn) {
        let sender = sender();
        let amount = msg.amount;
        
        let currentBalance = self.balances.get(sender) ?? 0;
        require(currentBalance >= amount, "Insufficient balance");
        
        self.balances.set(sender, currentBalance - amount);
        self.totalSupply = self.totalSupply - amount;
    }
    
    receive(msg: Transfer) {
        let sender = sender();
        let to = msg.to;
        let amount = msg.amount;
        
        let senderBalance = self.balances.get(sender) ?? 0;
        require(senderBalance >= amount, "Insufficient balance");
        
        let recipientBalance = self.balances.get(to) ?? 0;
        
        self.balances.set(sender, senderBalance - amount);
        self.balances.set(to, recipientBalance + amount);
    }
    
    get fun balance(address: Address): Int {
        return self.balances.get(address) ?? 0;
    }
    
    get fun totalSupply(): Int {
        return self.totalSupply;
    }
    
    get fun getMarketId(): Int {
        return self.marketId;
    }
    
    get fun getOutcome(): Bool {
        return self.outcome;
    }
}
