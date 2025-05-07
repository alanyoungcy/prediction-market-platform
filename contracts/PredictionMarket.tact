import "@stdlib/deploy";

message CreateMarket {
    question: String;
    description: String;
    category: String;
    endTime: Int;
    initialLiquidity: Int;
}

message BuyShares {
    marketId: Int;
    outcome: Bool; // true for YES, false for NO
    amount: Int;
}

message SellShares {
    marketId: Int;
    outcome: Bool; // true for YES, false for NO
    amount: Int;
}

message ResolveMarket {
    marketId: Int;
    outcome: Bool; // true for YES, false for NO
}

struct Market {
    id: Int;
    creator: Address;
    question: String;
    description: String;
    category: String;
    endTime: Int;
    resolved: Bool;
    outcome: Bool?;
    yesShares: Int;
    noShares: Int;
    liquidity: Int;
}

contract PredictionMarket {
    owner: Address;
    nextMarketId: Int;
    markets: map<Int, Market>;
    
    init(owner: Address) {
        self.owner = owner;
        self.nextMarketId = 0;
    }
    
    receive(msg: CreateMarket) {
        let marketId = self.nextMarketId;
        self.nextMarketId = self.nextMarketId + 1;
        
        let market = Market{
            id: marketId,
            creator: sender(),
            question: msg.question,
            description: msg.description,
            category: msg.category,
            endTime: msg.endTime,
            resolved: false,
            outcome: null,
            yesShares: msg.initialLiquidity / 2,
            noShares: msg.initialLiquidity / 2,
            liquidity: msg.initialLiquidity
        };
        
        self.markets.set(marketId, market);
        
        // TODO: Mint YES and NO tokens for the creator
    }
    
    receive(msg: BuyShares) {
        require(self.markets.get(msg.marketId) != null, "Market not found");
        let market = self.markets.get(msg.marketId)!!;
        
        require(!market.resolved, "Market already resolved");
        require(now() < market.endTime, "Market ended");
        
        // Calculate price based on constant product AMM formula
        let yesShares = market.yesShares;
        let noShares = market.noShares;
        let k = yesShares * noShares; // Constant product
        
        if (msg.outcome) { // Buying YES shares
            let newYesShares = yesShares - msg.amount;
            let newNoShares = k / newYesShares;
            let cost = newNoShares - noShares;
            
            require(newYesShares > 0, "Insufficient liquidity");
            
            market.yesShares = newYesShares;
            market.noShares = newNoShares;
            market.liquidity = market.liquidity + cost;
        } else { // Buying NO shares
            let newNoShares = noShares - msg.amount;
            let newYesShares = k / newNoShares;
            let cost = newYesShares - yesShares;
            
            require(newNoShares > 0, "Insufficient liquidity");
            
            market.yesShares = newYesShares;
            market.noShares = newNoShares;
            market.liquidity = market.liquidity + cost;
        }
        
        self.markets.set(msg.marketId, market);
    }
    
    receive(msg: SellShares) {
        require(self.markets.get(msg.marketId) != null, "Market not found");
        let market = self.markets.get(msg.marketId)!!;
        
        require(!market.resolved, "Market already resolved");
        
        // Calculate price based on constant product AMM formula
        let yesShares = market.yesShares;
        let noShares = market.noShares;
        let k = yesShares * noShares; // Constant product
        
        if (msg.outcome) { // Selling YES shares
            let newYesShares = yesShares + msg.amount;
            let newNoShares = k / newYesShares;
            let payout = noShares - newNoShares;
            
            market.yesShares = newYesShares;
            market.noShares = newNoShares;
            market.liquidity = market.liquidity - payout;
        } else { // Selling NO shares
            let newNoShares = noShares + msg.amount;
            let newYesShares = k / newNoShares;
            let payout = yesShares - newYesShares;
            
            market.yesShares = newYesShares;
            market.noShares = newNoShares;
            market.liquidity = market.liquidity - payout;
        }
        
        self.markets.set(msg.marketId, market);
    }
    
    receive(msg: ResolveMarket) {
        require(sender() == self.owner, "Only owner can resolve markets");
        require(self.markets.get(msg.marketId) != null, "Market not found");
        
        let market = self.markets.get(msg.marketId)!!;
        require(!market.resolved, "Market already resolved");
        require(now() >= market.endTime, "Market not ended yet");
        
        market.resolved = true;
        market.outcome = msg.outcome;
        
        self.markets.set(msg.marketId, market);
        
        // TODO: Allow users to claim winnings
    }
    
    get fun getMarket(marketId: Int): Market? {
        return self.markets.get(marketId);
    }
    
    get fun getMarkets(): map<Int, Market> {
        return self.markets;
    }
    
    get fun getYesPrice(marketId: Int): Int {
        require(self.markets.get(marketId) != null, "Market not found");
        let market = self.markets.get(marketId)!!;
        
        let yesShares = market.yesShares;
        let noShares = market.noShares;
        
        // Calculate price as a percentage (0-100)
        return (noShares * 100) / (yesShares + noShares);
    }
    
    get fun getNoPrice(marketId: Int): Int {
        require(self.markets.get(marketId) != null, "Market not found");
        let market = self.markets.get(marketId)!!;
        
        let yesShares = market.yesShares;
        let noShares = market.noShares;
        
        // Calculate price as a percentage (0-100)
        return (yesShares * 100) / (yesShares + noShares);
    }
}
