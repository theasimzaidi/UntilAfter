const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, select: false },
  address: { type: String },
  friendsWithPermission : [{ type: Schema.Types.ObjectId, ref: "User", default:"" }],
  // city: { type: String },
  // state: { type: String },
  // zipcode: { type: String },
  invitecode: { type: String },
  birthdate: { type: Date },
  // friends : [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
  journals : [{ type: Schema.Types.ObjectId, ref: "Journal"}],
  isAdmin: { type: Boolean, default: false },
  underInvestigation: { type: Boolean, default: false},
  accountOpenRequested: { type: Boolean, default: false},
  dead: { type: Boolean, default: false }
});

// const User = mongoose.model("User", UserSchema);
UserSchema.pre("save", function(next) {
  
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  // ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    }); //ends bcrypt.hash()

  }); //ends bcrypt.genSalt()

}); //end UserSchema.pre()
  
// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
}; //ends comparePassword

module.exports = mongoose.model("User", UserSchema);