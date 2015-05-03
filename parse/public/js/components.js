LoginView = React.createClass({

  facebookLogIn: function() {
    Parse.FacebookUtils.init({
      appId      : '438605306303003',
      xfbml      : true,
      version    : 'v2.3'
    });
    
    Parse.FacebookUtils.logIn(null, {
        success: function(user) {
            if (!user.existed()) {
                console.log("!");
            } else {
                console.log("User logged in through Facebook!");
                location.reload();
            }
        },
        error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
        }
    });
  }

  render: function() {
      return (<header id="header"></header>
        <div className="login">
          <form className="login-form">
            <h2>Log In</h2>
            <div className="error" style={display:none}></div>
            <input type="text" id="login-username" placeholder="Username" />
            <input type="password" id="login-password" placeholder="Password" />
            <button>Log In</button>
          </form>

          <form className="signup-form">
            <h2>Sign Up</h2>
            <div className="error" style={display:none}></div>
            <input type="text" id="signup-username" placeholder="Username" />
            <input type="password" id="signup-password" placeholder="Create a Password" />
            <button>Sign Up</button>
          </form>
        </div>
        
        <button onclick={this.facebookLogIn}>Log In Through Facebook</button>
      )
  }

});

NavBar = React.createClass({

  render: function() {
    return (
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">PingBox</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
            <ul className="nav navbar-nav">
              <li className="active"><a href="#">App <span className="sr-only">(current)</span></a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Help</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Sign in or out or whatever. I don't care.</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }


