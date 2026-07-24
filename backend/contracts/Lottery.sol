// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/// @title SCAI Lucky Loop Lottery Contract

contract Lottery {

    address public owner;

    uint256 public lotteryId;

    uint256 public ticketPrice;

    bool public lotteryOpen;

    // NEW
    uint256 public lotteryEndTime;

    uint256 public ticketDuration = 1 days;

    uint256 public totalTicketsSold;

    uint256 public totalPrizeDistributed;

    uint256 public totalLotteriesCompleted;

    address[] private players;
    struct UserInfo {
    uint256 totalTickets;
    uint256 totalWins;
    uint256 rewardBalance;
   }

   struct Ticket {
    uint256 ticketNumber;
    uint256 lotteryId;
    bool winner;
    uint256 timestamp;
   }

    mapping(address => UserInfo) public users;

    mapping(address => Ticket[]) private userTickets;

    uint256 private nextTicketNumber = 1001;

    struct LotteryRound {
        uint256 id;
        uint256 prizePool;
        uint256 totalPlayers;
        address winner;
        uint256 timestamp;
        bool completed;
    }

    mapping(uint256 => LotteryRound) public history;

    event TicketPurchased(
        address indexed player,
        uint256 indexed lotteryId,
        uint256 amount
    );

    event WinnerSelected(
        address indexed winner,
        uint256 indexed lotteryId,
        uint256 prize
    );
     
     event RewardCredited(
    address indexed user,
    uint256 amount
    );

    event LotteryOpened(uint256 indexed lotteryId);

    event LotteryClosed(uint256 indexed lotteryId);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner"
        );
        _;
    }

    modifier lotteryIsOpen() {
        require(
            lotteryOpen,
            "Lottery closed"
        );
        _;
    }

    constructor() {

        owner = msg.sender;

        lotteryId = 1;

        ticketPrice = 0.01 ether;

        lotteryOpen = true;

        // NEW
        // NEW
lotteryEndTime = block.timestamp + ticketDuration;
    }
                 
                   function buyTicketUsingReward()
    external
    lotteryIsOpen
{
    require(
        block.timestamp < lotteryEndTime,
        "Ticket sale has ended"
    );

    require(
        users[msg.sender].rewardBalance >= ticketPrice,
        "Insufficient reward balance"
    );

    users[msg.sender].rewardBalance -= ticketPrice;

    players.push(msg.sender);

    users[msg.sender].totalTickets++;

    userTickets[msg.sender].push(
        Ticket({
            ticketNumber: nextTicketNumber,
            lotteryId: lotteryId,
            winner: false,
            timestamp: block.timestamp
        })
    );

    nextTicketNumber++; 

    totalTicketsSold++;

    emit TicketPurchased(
        msg.sender,
        lotteryId,
        ticketPrice
    );
}

    function buyTicket()
        external
        payable
        lotteryIsOpen
    {

        require(
            block.timestamp < lotteryEndTime,
            "Ticket sale has ended"
        );

        require(
            msg.value == ticketPrice,
            "Invalid ticket price"
        );

        players.push(msg.sender);

        users[msg.sender].totalTickets++;

    userTickets[msg.sender].push(
    Ticket({
        ticketNumber: nextTicketNumber,
        lotteryId: lotteryId,
        winner: false,
        timestamp: block.timestamp
    })
   );

      nextTicketNumber++;

        totalTicketsSold++;

        emit TicketPurchased(
            msg.sender,
            lotteryId,
            msg.value
        );
    }

    function getPlayers()
        external
        view
        returns(address[] memory)
    {
        return players;
    }

    function getPlayersCount()
        external
        view
        returns(uint256)
    {
        return players.length;
    }

    function getPrizePool()
        public
        view
        returns(uint256)
    {
        return address(this).balance;
    }

    function setTicketPrice(
        uint256 newPrice
    )
        external
        onlyOwner
    {

        require(
            newPrice > 0,
            "Invalid price"
        );

        ticketPrice = newPrice;
    }

    function setTicketDuration(
    uint256 durationInSeconds
)
    external
    onlyOwner
{
    require(
        durationInSeconds > 0,
        "Invalid duration"
    );

    ticketDuration = durationInSeconds;
}

    function openLottery()
        external
        onlyOwner
    {

        lotteryOpen = true;

        // NEW
        lotteryEndTime = block.timestamp + ticketDuration;

        emit LotteryOpened(
            lotteryId
        );
    }

    function closeLottery()
        external
        onlyOwner
    {

        lotteryOpen = false;

        emit LotteryClosed(
            lotteryId
        );
    }

    function selectWinner()
        external
        onlyOwner
    {

        require(
            lotteryOpen,
            "Lottery closed"
        );
        
         require(
    block.timestamp >= lotteryEndTime,
    "Lottery is still running"
);

        require(
            players.length > 0,
            "No players"
        );

        lotteryOpen = false;

        uint256 random =
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        block.number,
                        players.length
                    )
                )
            );

        uint256 winnerIndex =
            random % players.length;

        address winner =
            players[winnerIndex];

        uint256 prize =
            address(this).balance;

        payable(winner).transfer(prize);

        users[winner].totalWins++;

     users[winner].rewardBalance += ticketPrice;

     uint256 lastIndex =
    userTickets[winner].length - 1;

     userTickets[winner][lastIndex].winner = true;

     emit RewardCredited(
    winner,
    ticketPrice
    );

        history[lotteryId] = LotteryRound({
            id: lotteryId,
            prizePool: prize,
            totalPlayers: players.length,
            winner: winner,
            timestamp: block.timestamp,
            completed: true
        });

        totalPrizeDistributed += prize;

        totalLotteriesCompleted++;

        emit WinnerSelected(
            winner,
            lotteryId,
            prize
        );

        delete players;

        lotteryId++;

       lotteryOpen = true;

// NEW
lotteryEndTime = block.timestamp + ticketDuration;
    }
      
                    function getUserTickets(
    address user
)
    external
    view
    returns (Ticket[] memory)
{
    return userTickets[user];
}

          function getRewardBalance(
    address user
)
    external
    view
    returns (uint256)
{
    return users[user].rewardBalance;
}

function getTotalWins(
    address user
)
    external
    view
    returns (uint256)
{
    return users[user].totalWins;
}

function getTotalUserTickets(
    address user
)
    external
    view
    returns (uint256)
{
    return users[user].totalTickets;
}

function getNextTicketNumber()
    external
    view
    returns (uint256)
{
    return nextTicketNumber;
}

    function getLotteryRound(
        uint256 id
    )
        external
        view
        returns(
            LotteryRound memory
        )
    {
        return history[id];
    }

    function getCurrentLotteryId()
        external
        view
        returns(uint256)
    {
        return lotteryId;
    }

    function withdraw()
        external
        onlyOwner
    {

        require(
            address(this).balance > 0,
            "No balance"
        );

        payable(owner).transfer(
            address(this).balance
        );
    }

    function transferOwnership(
        address newOwner
    )
        external
        onlyOwner
    {

        require(
            newOwner != address(0),
            "Invalid owner"
        );

        owner = newOwner;
    }

    receive() external payable {}

}