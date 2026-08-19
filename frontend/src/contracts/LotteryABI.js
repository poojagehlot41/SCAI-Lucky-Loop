// Lottery contract ABI
const LotteryABI = [
  {"inputs":[{"internalType":"address","name":"_scaiToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"LotteryClosed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"}],"name":"LotteryOpened","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"}],"name":"ReferralRegistered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReferralRewardPaid","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardClaimed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardCredited","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TicketPurchased","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"uint256","name":"lotteryId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerSelected","type":"event"},

  {"inputs":[],"name":"buyTicket","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"closeLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},

  {"inputs":[],"name":"getContractEthBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getContractScaiBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getCurrentLotteryId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getHistory","outputs":[
    {"internalType":"uint256","name":"","type":"uint256"},
    {"internalType":"uint256","name":"","type":"uint256"},
    {"internalType":"uint256","name":"","type":"uint256"},
    {"internalType":"address","name":"","type":"address"},
    {"internalType":"uint256","name":"","type":"uint256"},
    {"internalType":"bool","name":"","type":"bool"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[],"name":"getLotteryDetails","outputs":[
    {"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"uint256","name":"price","type":"uint256"},
    {"internalType":"bool","name":"isOpen","type":"bool"},
    {"internalType":"uint256","name":"endTime","type":"uint256"},
    {"internalType":"uint256","name":"playersCount","type":"uint256"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getLotteryRound","outputs":[
    {"components":[
      {"internalType":"uint256","name":"id","type":"uint256"},
      {"internalType":"uint256","name":"prizePool","type":"uint256"},
      {"internalType":"uint256","name":"totalPlayers","type":"uint256"},
      {"internalType":"address","name":"winner","type":"address"},
      {"internalType":"uint256","name":"timestamp","type":"uint256"},
      {"internalType":"bool","name":"completed","type":"bool"}
    ],"internalType":"struct Lottery.LotteryRound","name":"","type":"tuple"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[],"name":"getPlayersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getPrizePool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getReferralRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getRewardBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getTimeRemaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getTotalWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserTickets","outputs":[
    {"components":[
      {"internalType":"uint256","name":"ticketNumber","type":"uint256"},
      {"internalType":"uint256","name":"lotteryId","type":"uint256"},
      {"internalType":"bool","name":"winner","type":"bool"},
      {"internalType":"uint256","name":"timestamp","type":"uint256"}
    ],"internalType":"struct Lottery.Ticket[]","name":"","type":"tuple[]"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"history","outputs":[
    {"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"uint256","name":"prizePool","type":"uint256"},
    {"internalType":"uint256","name":"totalPlayers","type":"uint256"},
    {"internalType":"address","name":"winner","type":"address"},
    {"internalType":"uint256","name":"timestamp","type":"uint256"},
    {"internalType":"bool","name":"completed","type":"bool"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[],"name":"isTicketSaleOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lotteryEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lotteryId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lotteryOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lotteryResultDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  {"inputs":[],"name":"openLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referralCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"referralReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referralRewardsEarned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"registerReferral","outputs":[],"stateMutability":"nonpayable","type":"function"},

  {"inputs":[],"name":"scaiToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"selectWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},

  {"inputs":[{"internalType":"uint256","name":"durationInSeconds","type":"uint256"}],"name":"setTicketDuration","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setTicketPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setWinnerScaiReward","outputs":[],"stateMutability":"nonpayable","type":"function"},

  {"inputs":[],"name":"ticketDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalLotteriesCompleted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalPrizeDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalReferralRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalTicketsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},

  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[
    {"internalType":"uint256","name":"totalTickets","type":"uint256"},
    {"internalType":"uint256","name":"totalWins","type":"uint256"},
    {"internalType":"uint256","name":"rewardBalance","type":"uint256"}
  ],"stateMutability":"view","type":"function"},

  {"inputs":[],"name":"winnerScaiReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawUnusedScai","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

export default LotteryABI;