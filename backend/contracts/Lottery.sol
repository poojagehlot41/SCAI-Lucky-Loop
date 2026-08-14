// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SCAI Lucky Loop Lottery Contract
contract Lottery {

    address public owner;
    IERC20 public scaiToken;

    uint256 public lotteryId;
    uint256 public ticketPrice;
    bool public lotteryOpen;

    uint256 public lotteryEndTime;
    uint256 public ticketDuration = 1 days;

    uint256 public lotteryStartHour = 9;
    uint256 public lotteryEndHour = 21;

    uint256 public lotteryResultDelay = 5 minutes;

    uint256 public totalTicketsSold;
    uint256 public totalPrizeDistributed;
    uint256 public totalLotteriesCompleted;

    uint256 public referralReward = 0.001 ether;
    uint256 public totalReferralRewards;

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

    struct LotteryRound {
        uint256 id;
        uint256 prizePool;
        uint256 totalPlayers;
        address winner;
        uint256 timestamp;
        bool completed;
    }

    mapping(address => UserInfo) public users;
    mapping(address => Ticket[]) private userTickets;
    mapping(uint256 => LotteryRound) public history;

    mapping(address => address) public referrerOf;
    mapping(address => uint256) public referralCount;
    mapping(address => uint256) public referralRewardsEarned;

    uint256 private nextTicketNumber = 1001;

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

    event RewardClaimed(
        address indexed user,
        uint256 amount
    );

    event LotteryOpened(
        uint256 indexed lotteryId
    );

    event LotteryClosed(
        uint256 indexed lotteryId
    );

    event ReferralRegistered(
        address indexed user,
        address indexed referrer
    );

    event ReferralRewardPaid(
        address indexed referrer,
        address indexed user,
        uint256 amount
    );

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

    constructor(address _scaiToken) {
        require(
            _scaiToken != address(0),
            "Invalid SCAI token"
        );

        owner = msg.sender;
        scaiToken = IERC20(_scaiToken);

        lotteryId = 1;
        ticketPrice = 0.01 ether;
        lotteryOpen = true;

        lotteryEndTime =
            block.timestamp +
            ticketDuration;
    }

    function isTicketSaleOpen()
        public
        view
        returns (bool)
    {
        if (!lotteryOpen) {
            return false;
        }

        return (
            block.timestamp < lotteryEndTime &&
            block.timestamp >=
            lotteryEndTime - ticketDuration
        );
    }

    // =========================
    // REFERRAL
    // =========================

    function registerReferral(
        address referrer
    )
        external
    {
        require(
            referrer != address(0),
            "Invalid referrer"
        );

        require(
            referrer != msg.sender,
            "Cannot refer yourself"
        );

        require(
            referrerOf[msg.sender] == address(0),
            "Referral already registered"
        );

        referrerOf[msg.sender] = referrer;

        emit ReferralRegistered(
            msg.sender,
            referrer
        );
    }

    function _recordReferralOnFirstPurchase(
        address user
    )
        internal
    {
        address referrer =
            referrerOf[user];

        if (
            referrer != address(0) &&
            users[user].totalTickets == 0
        ) {
            referralCount[referrer] += 1;

            uint256 reward =
                referralReward;

            referralRewardsEarned[referrer] +=
                reward;

            totalReferralRewards +=
                reward;

            emit ReferralRewardPaid(
                referrer,
                user,
                reward
            );
        }
    }

    // =========================
    // BUY TICKET
    // =========================

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

        _recordReferralOnFirstPurchase(
            msg.sender
        );

        players.push(msg.sender);

        users[msg.sender].totalTickets++;

        userTickets[msg.sender].push(
            Ticket({
                ticketNumber:
                    nextTicketNumber,
                lotteryId:
                    lotteryId,
                winner:
                    false,
                timestamp:
                    block.timestamp
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

    function buyTicketUsingReward()
        external
        lotteryIsOpen
    {
        require(
            block.timestamp < lotteryEndTime,
            "Ticket sale has ended"
        );

        require(
            users[msg.sender].rewardBalance >=
            ticketPrice,
            "Insufficient reward balance"
        );

        _recordReferralOnFirstPurchase(
            msg.sender
        );

        users[msg.sender].rewardBalance -=
            ticketPrice;

        players.push(msg.sender);

        users[msg.sender].totalTickets++;

        userTickets[msg.sender].push(
            Ticket({
                ticketNumber:
                    nextTicketNumber,
                lotteryId:
                    lotteryId,
                winner:
                    false,
                timestamp:
                    block.timestamp
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

    // =========================
    // PLAYERS
    // =========================

    function getPlayers()
        external
        view
        returns (address[] memory)
    {
        return players;
    }

    function getPlayersCount()
        external
        view
        returns (uint256)
    {
        return players.length;
    }

    function getPrizePool()
        public
        view
        returns (uint256)
    {
        return address(this).balance;
    }

    // =========================
    // SETTINGS
    // =========================

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

        ticketDuration =
            durationInSeconds;
    }

    // =========================
    // LOTTERY CONTROL
    // =========================

    function openLottery()
        external
        onlyOwner
    {
        lotteryOpen = true;

        lotteryEndTime =
            block.timestamp +
            ticketDuration;

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

    // =========================
    // WINNER SELECTION
    // =========================

    function selectWinner()
        external
    {
        require(
            players.length > 0,
            "No players"
        );

        require(
            !lotteryOpen,
            "Close the lottery before selecting winner"
        );

        require(
            block.timestamp >=
            lotteryEndTime +
            lotteryResultDelay,
            "Winner selection not available yet"
        );

        uint256 random =
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        block.number,
                        players.length,
                        lotteryId
                    )
                )
            );

        uint256 winnerIndex =
            random % players.length;

        address winner =
            players[winnerIndex];

        uint256 currentLotteryId =
            lotteryId;

        uint256 prize =
            address(this).balance;

        // Mark winning ticket
        Ticket[] storage tickets =
            userTickets[winner];

        for (
            uint256 i = 0;
            i < tickets.length;
            i++
        ) {
            if (
                tickets[i].lotteryId ==
                currentLotteryId
            ) {
                tickets[i].winner =
                    true;
                break;
            }
        }

        users[winner].totalWins++;

        // SCAI reward
        require(
            scaiToken.balanceOf(address(this)) >=
            ticketPrice,
            "Insufficient SCAI reward balance"
        );

        users[winner].rewardBalance +=
            ticketPrice;

        emit RewardCredited(
            winner,
            ticketPrice
        );

        // ETH prize pool
        if (prize > 0) {
            payable(winner).transfer(
                prize
            );
        }

        history[currentLotteryId] =
            LotteryRound({
                id:
                    currentLotteryId,

                prizePool:
                    prize,

                totalPlayers:
                    players.length,

                winner:
                    winner,

                timestamp:
                    block.timestamp,

                completed:
                    true
            });

        totalPrizeDistributed +=
            prize;

        totalLotteriesCompleted++;

        emit WinnerSelected(
            winner,
            currentLotteryId,
            prize
        );

        delete players;

        lotteryId++;

        lotteryOpen = true;

        lotteryEndTime =
            block.timestamp +
            ticketDuration;
    }

    // =========================
    // USER DATA
    // =========================

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

    // =========================
    // LOTTERY HISTORY
    // =========================

    function getLotteryRound(
        uint256 id
    )
        external
        view
        returns (LotteryRound memory)
    {
        return history[id];
    }

    function getLatestLotteryResult()
        external
        view
        returns (LotteryRound memory)
    {
        require(
            totalLotteriesCompleted > 0,
            "No completed lottery yet"
        );

        return history[
            lotteryId - 1
        ];
    }

    function getCurrentLotteryId()
        external
        view
        returns (uint256)
    {
        return lotteryId;
    }

    // =========================
    // REFERRAL DATA
    // =========================

    function getReferrer(
        address user
    )
        external
        view
        returns (address)
    {
        return referrerOf[user];
    }

    function getReferralCount(
        address user
    )
        external
        view
        returns (uint256)
    {
        return referralCount[user];
    }

    function getReferralRewards(
        address user
    )
        external
        view
        returns (uint256)
    {
        return referralRewardsEarned[user];
    }

    // =========================
    // REWARD
    // =========================

    function claimReward()
        external
    {
        uint256 amount =
            users[msg.sender].rewardBalance;

        require(
            amount > 0,
            "No reward available"
        );

        require(
            scaiToken.balanceOf(address(this)) >=
            amount,
            "Insufficient SCAI balance"
        );

        users[msg.sender].rewardBalance =
            0;

        require(
            scaiToken.transfer(
                msg.sender,
                amount
            ),
            "SCAI transfer failed"
        );

        emit RewardClaimed(
            msg.sender,
            amount
        );
    }

    // =========================
    // OWNER
    // =========================

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

    receive()
        external
        payable
    {}
}