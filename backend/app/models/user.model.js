const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/\S+@\S+.\S+/, "is invalid"],
            index: true,
        },
        bio: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "https://static.productionready.io/images/smiley-cyrus.jpg",
        },
        refresh_token: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m" } // Expiración corta (15 minutos)
    );
    return accessToken;
};

// @desc generate refresh token for a user
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" } // Expiración larga (7 días)
    );
    return refreshToken;
};

//login user
userSchema.methods.toUserResponse = function () {
    const accessToken = this.generateAccessToken();
    const refreshToken = this.generateRefreshToken();

    // Almacenar el refresh token generado en la base de datos
    this.refresh_token = refreshToken;
    this.save(); // Guardar el refresh token en el modelo

    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: accessToken,
        refresh_token: refreshToken,
    };
};

//get Current User
userSchema.methods.toUserDetails = function () {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
    };
};


userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false
    }
};

userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    for (const followingUser of this.followingUsers) {
        if (followingUser.toString() === idStr) {
            return true;
        }
    }
    return false;
};

userSchema.methods.follow = function (id) {
    if (this.followingUsers.indexOf(id) === -1) {
        this.followingUsers.push(id);
    }
    return this.save();
};

userSchema.methods.unfollow = function (id) {
    if (this.followingUsers.indexOf(id) !== -1) {
        this.followingUsers.remove(id);
    }
    return this.save();
};

userSchema.methods.isFavourite = function (id) {
    const idStr = id.toString();
    for (const article of this.favouriteArticles) {
        if (article.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.favorite = function (id) {
    if (this.favouriteArticles.indexOf(id) === -1) {
        this.favouriteArticles.push(id);
    }

    // const article = await Article.findById(id).exec();
    //
    // article.favouritesCount += 1;
    //
    // await article.save();

    return this.save();
}

userSchema.methods.unfavorite = function (id) {
    if (this.favouriteArticles.indexOf(id) !== -1) {
        this.favouriteArticles.remove(id);
    }

    // const article = await Article.findById(id).exec();
    //
    // article.favouritesCount -= 1;
    //
    // await article.save();

    return this.save();
};

module.exports = mongoose.model('User', userSchema);
