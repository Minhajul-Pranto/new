const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },

    // User Type
    userType: {
      type: String,
      enum: ['learner', 'instructor', 'admin'],
      required: [true, 'Please specify user type'],
    },

    // Learner Specific Fields
    learnerProfile: {
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
      },
      skills: [
        {
          type: String,
        },
      ],
      learningGoals: [
        {
          type: String,
        },
      ],
      enrolledCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      completedCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      certificates: [
        {
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
          },
          certificateUrl: String,
          issuedDate: Date,
        },
      ],
      progress: [
        {
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
          },
          progressPercentage: {
            type: Number,
            min: 0,
            max: 100,
          },
          lastAccessed: Date,
        },
      ],
      bookmarkedCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      totalSpentHours: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },

    // Instructor Specific Fields
    instructorProfile: {
      bio: {
        type: String,
        maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      },
      expertise: [
        {
          type: String,
        },
      ],
      qualifications: [
        {
          qualification: String,
          institution: String,
          year: Number,
        },
      ],
      createdCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      publishedCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalCourses: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      socialLinks: {
        website: String,
        linkedin: String,
        twitter: String,
        github: String,
      },
      bankAccount: {
        accountHolder: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationDate: Date,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,

    // Address Information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Preferences
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        default: 'en',
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },

    // Metadata
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    registrationIp: String,
    suspendedUntil: Date,
    suspensionReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware (hash password)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // Password hashing logic should be implemented here
  // Example: this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
