const groupedTrades = data.message.reduce((trade_dict: any, item: any) => {
    const d = item.order_created_at.split('T')[0]; // Extract date part
    const dateObj = new Date(d);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = dateObj.toLocaleDateString('en-US', options);

    if (!trade_dict[date]) {
        trade_dict[date] = { trades: [], totalBuy: 0, totalSell: 0 };
    }
    const amount = parseFloat(item.price) * parseFloat(item.processed_quantity);
    trade_dict[date].trades.push(item);
    if (item.side === 'buy') {
        trade_dict[date].totalBuy += amount;
    } else {
        trade_dict[date].totalSell += amount;
    }
    return trade_dict;
}, {});

 // Format the selected date to match the key format in groupedTrades
    const selectedDateStr = date instanceof Date ? date.toISOString().split('T')[0] : '';

    // Find the P&L for the selected date
    const pnl = groupedTrades[selectedDateStr] ? ((groupedTrades[selectedDateStr].totalSell - groupedTrades[selectedDateStr].totalBuy) * 100).toFixed(2) : null;

    // Calculate total PnL for all trades
    const totalPnL = Object.values(groupedTrades).reduce((total: number, group: any) => {
        return (total + (group.totalSell - group.totalBuy) * 100);
    }, 0);

    // Calculate the number of days with positive P&L
    const positivePnLDays = Object.values(groupedTrades as Record<string, { totalSell: number; totalBuy: number }>).reduce((count: number, group) => {
        if (group.totalSell - group.totalBuy > 0) {
            return count + 1;
        }
        return count;
    }, 0);
    

return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Stats</h1>
        <div className="mb-4 bg-white shadow rounded p-4">
            <h2 className="font-bold text-xl">Total Profit/Loss</h2>
            <p>${totalPnL.toFixed(2)}</p>
            <h2 className="font-bold text-xl">Positive Days</h2>
            <p>{positivePnLDays.toFixed(2)}</p>
            
        </div>

        <h1 className="text-3xl font-bold mb-4">Recent Trades</h1>
        <div className="flex flex-wrap">
            {Object.entries(groupedTrades).map(([date, info]: [string, any], index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{date}</CardTitle>                     
                    </CardHeader>
                    <div className="bg-white shadow rounded p-4">
                        <p className="mb-4">{
                            ((info.totalSell - info.totalBuy) * 100) >= 0 ?
                            `Profit: $${((info.totalSell - info.totalBuy) * 100).toFixed(2)}` :
                            `Loss: $${((info.totalSell - info.totalBuy) * 100).toFixed(2)}`}
                        </p>
                        {/* {info.trades.map((trade: any, tradeIndex: any) => (
                            <div key={tradeIndex} className="mb-3">
                                <p>Symbol: {trade.symbol}</p>
                                <p>Order Time: {trade.order_created_at}</p>
                                <p>Price: {trade.price}</p>
                                <p>Quantity: {trade.processed_quantity}</p>
                                <p>Side: {trade.side}</p>
                            </div>
                        ))} */}    
                    </div>
                </Card>
                
                
            ))}
        </div>