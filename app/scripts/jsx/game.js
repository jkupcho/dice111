var Game = React.createClass({
  defaultState: {
      players: [],
      activePlayer: {},
      gameWon: false,
      currentActive: 0,
      gameStarted: false,
      winner: {},
      winningScore: 111
  },
  getInitialState: function () {
    return this.defaultState;
  },
  nextPlayer: function() {
    var currentActive = this.state.currentActive;
    var activePlayer = this.state.players[currentActive];
    activePlayer.isActive = false;
    activePlayer.score += activePlayer.currentScore;
    activePlayer.currentScore = 0;
    if (currentActive === this.state.players.length - 1) {
      currentActive = 0;
    } else {
      ++currentActive;
    }
    var activePlayer = this.state.players[currentActive];
    activePlayer.isActive = true;
    this.setState({
      activePlayer: activePlayer,
      currentActive: currentActive
    });
  },
  rollDie: function (roll) {
    var activePlayer = this.state.activePlayer;
    if (roll === 1) {
      activePlayer.currentScore = 0;
    } else {
      activePlayer.currentScore += roll;
    }
    if (activePlayer.score + activePlayer.currentScore >= 111) {
      this.setState({
        gameWon: true,
        winner: activePlayer
      });
    }
    else {
      this.setState({
        activePlayer: activePlayer
      });
    } 
  },
  gameStartedHandler: function (event) {
    event.preventDefault();
    this.setState({
      gameStarted: true,
      activePlayer: this.state.players[this.state.currentActive]
    });
    this.state.players[this.state.currentActive].isActive = true;
  },
  entryHandle: function (playerName) {
    var players = this.state.players;
    players.push({ name: playerName, score: 0, currentScore: 0 });
    this.setState({
      players: players
    });
  },
  newGame: function () {
    var players = []
    this.state.players.forEach(function (player) {
      player.score = 0;
      player.currentScore = 0;
      player.isActive = false;
      players.push(player)
    });
    this.setState(this.defaultState);
  },
  render: function () {
    var block;
    if (!this.state.gameStarted) {
      block = <PlayerEntry playerName={this.state.playerName} entryHandle={this.entryHandle} canStart={this.state.players.length > 1} gameStartedHandler={this.gameStartedHandler} />;
    } else if (!this.state.gameWon) {
      block = <GameBoard activePlayer={this.state.activePlayer} rollDie={this.rollDie} nextPlayer={this.nextPlayer} />
    } else {
      block = 
        <div className="well">
          {this.state.activePlayer.name} won! Congrats!
          <button className="btn btn-info btn-lg" onClick={this.newGame}>New Game</button>
        </div>
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            {block}
          </div>
          <div className="col-md-4">
            <PlayerList players={this.state.players} showScore={this.state.gameStarted} />
          </div>
        </div>
      </div>
    )
  }
});

var GameBoard = React.createClass({
  getInitialState: function () {
    return {
      currentRoll: 0
    }
  },
  nextPlayer: function () {
    this.setState({
      currentRoll: 0
    });
    this.props.nextPlayer();
  },
  rollDie: function (event) {
    event.preventDefault();
    var roll = Math.floor((Math.random() * 6) + 1);
    this.setState({
      currentRoll: roll
    });
    this.props.rollDie(
      roll
    );
  },
  render: function () {
    var block;
    if (this.state.currentRoll === 0) {
      block = <h3>Roll to start, {this.props.activePlayer.name}!</h3>
    } else if (this.state.currentRoll === 1) {
      block = <h3>You rolled a 1, bummer dude! Switching to next player.</h3>
    } else {
      block = <h3>You rolled a {this.state.currentRoll}, keep going!</h3>
    }
    return (
      <div className="text-center">
        {block}
        { this.state.currentRoll !== 1 ? <button className="btn btn-primary btn-lg" onClick={this.rollDie}>Roll!</button> : null }
        { this.state.currentRoll !== 0 ? <button className="btn btn-danger btn-lg" onClick={this.nextPlayer}>Pass Dice</button> : null }
      </div>
    )
  }
});

var PlayerEntry = React.createClass({
  handleEntry: function (event) {
    event.preventDefault();
    var value = this.refs.playerEntryText.getDOMNode().value;
    if (value !== '' && value !== undefined) {
      this.props.entryHandle(
        this.refs.playerEntryText.getDOMNode().value
      );
      this.refs.playerEntryText.getDOMNode().value = '';
      $(this.refs.playerEntryText.getDOMNode()).focus();
    }
  },
  render: function () {
    var startGame;
    if (this.props.canStart) {
      startGame = <button className="btn btn-default pull-right" onClick={this.props.gameStartedHandler}>Start Game!</button>;
    }
    return (
      <div>
        <form className="form-inline">
          <div className="input-group">
            <input type="text" className="form-control" ref="playerEntryText" placeholder="Player Name" />
            <span className="input-group-btn">
              <button className="btn btn-info" onClick={this.handleEntry}><span className="glyphicon glyphicon-plus"></span></button>
            </span>
          </div>
          {startGame}
        </form>
      </div>
    )
  }
});

var PlayerList = React.createClass({
  render: function () {
    var players = [];
    var showScore = this.props.showScore;
    this.props.players.forEach(function (player) {
      players.push(
        <Player player={player} showScore={showScore} />
      );
    });
    var block;
    if (players.length === 0) { 
      block = <span>No Players</span>
    } else {
      block =
        <div>
          <h5>Players</h5>
          <ul className="list-group">
            {players}
          </ul>
        </div>;
    }
    return (
      <div className="well">
        {block}
      </div>
    )
  }
});

var Player = React.createClass({
  render: function () {
    return (
      <li className={ this.props.player.isActive ? 'list-group-item active' : 'list-group-item' }>
        {this.props.player.name}
        {this.props.showScore ? <span> - {this.props.player.score}</span> : null}
        {this.props.player.isActive ? <span> ({this.props.player.currentScore})</span> : null}
      </li>
    )
  }
});

React.render(
  <Game />,
  document.getElementById('game')
)