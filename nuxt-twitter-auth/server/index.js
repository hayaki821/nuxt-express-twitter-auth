const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

import cors from 'cors';


const app = express();
app.use(require('morgan')('combined')); // optional
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true, optionsSuccessStatus: 200  }));
app.use(
  require('express-session')({
    secret: 'some secret',
    resave: true,
    saveUninitialized: true,
    //store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      secure: 'auto',
      httpOnly: true,
      //secure: true,
      maxAge: 100000
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// twitter
passport.use(
  new TwitterStrategy(
    {
      consumerKey: "FNBKQt3RyIQGmf6CueBhOTJpl",
      consumerSecret: "3yZo9wx9a2DKP8xV0Cupjlqb0YfTrItqc3ZdxALJYYz57M04KD",
      callbackURL: "http://127.0.0.1:3000",
      includeEmail: true,
    },
    function(token, tokenSecret, profile, done) {
      console.log(token, tokenSecret,profile,"token");
      const {id,emails} = profile;
      console.log(id,emails);
      //req.cookie('hoge', 'fuga');
      // passport.session.user = profile;
      profile.access_token = token;
      profile.token_secret = tokenSecret;
      // process.nextTick(function () {
      //   return done(null, profile);
      // });
      return done(null,profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log(user,"serializeUser")
  //ユーザ情報をセッションに保存する
  done(null, user.id);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
  // IDからユーザ情報を特定し、req.userに格納する
  // await User.findById(id, function(err, user) {
  //   done(err, user);
  // });

});

// twitter
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  session: false
}), (req, res) => {
  // res.cookie('hoge', 'fuga');
  req.session.user = req.user.id;
   res.json({ user: req.user.id });
});

app.get('/user', (req, res) => {
  res.json({ user: req.session.user });
});


app.get('/logout', (req, res) => {
  req.logout();
  delete req.session.user;
  res.redirect('/login');
});


module.exports = {
  path: '/server',
  handler: app,
};
