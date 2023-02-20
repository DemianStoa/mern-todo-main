const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



// @desc Register
// @route POST /auth
// @access Public
const register = async (req, res) => {
    const { email, password, username } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

  // Validation
  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'Email has already been registered' })
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
  });

  //   Generate Token
  const accessToken = jwt.sign(
    {
        "UserInfo": {
            "username": user.username,
            "roles": user.roles
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
)

const refreshToken = jwt.sign(
    { "username": user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
)


  // Send HTTP-only cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

  if (user) {
    const { _id, username, email, avatar, phone, bio } = user;
    res.status(201).json({
      _id,
      username,
      email,
      avatar,
      phone,
      bio,
      accessToken,
    });
  } else {
    res.status(400).json({ message: 'server failed' });

  }
}


// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()
    console.log(foundUser)

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    if (foundUser) {
        const { _id, username, email, avatar, phone, bio } = foundUser;
        res.status(201).json({
          _id,
          username,
          email,
          avatar,
          phone,
          bio,
          accessToken,
        });
      } else {
        res.status(400);
        throw new Error("Invalid user email or password");
      }
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt
    console.log(refreshToken+"hello")

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout,
    register
}