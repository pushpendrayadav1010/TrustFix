import { mockUsers } from '../mock/users';
import { mockProviders } from '../mock/providers';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Mock login: matches email or matches predefined sample credentials
  login: async ({ email, password }) => {
    await delay(250);
    const normalizedEmail = (email || '').trim().toLowerCase();
    
    // Check known mock users
    let user = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    
    // Fallback: dynamic creation for demo if not found
    if (!user) {
      if (normalizedEmail.includes('provider')) {
        user = {
          id: Date.now(),
          name: email.split('@')[0].toUpperCase(),
          email: normalizedEmail,
          phone: "+91 98000 00000",
          role: "PROVIDER",
          providerProfileId: 101,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
          city: "Thane",
          createdAt: new Date().toISOString()
        };
      } else {
        user = {
          id: Date.now(),
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: normalizedEmail,
          phone: "+91 98200 11111",
          role: "CUSTOMER",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          city: "Mumbai",
          createdAt: new Date().toISOString()
        };
      }
    }

    // Attach provider profile if provider
    let providerProfile = null;
    if (user.role === 'PROVIDER') {
      providerProfile = mockProviders.find(p => p.id === user.providerProfileId || p.email.toLowerCase() === user.email.toLowerCase()) || mockProviders[0];
    }

    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    return {
      success: true,
      user,
      providerProfile,
      token,
      message: "Login successful"
    };
  },

  // Mock register: Customer or Provider
  register: async ({ name, email, phone, password, role, service, serviceArea }) => {
    await delay(300);
    const normalizedEmail = (email || '').trim().toLowerCase();
    const newUserId = Date.now();
    const newUser = {
      id: newUserId,
      name,
      email: normalizedEmail,
      phone,
      role: role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER',
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      city: serviceArea || "Mumbai",
      createdAt: new Date().toISOString()
    };

    let newProvider = null;
    if (role === 'PROVIDER') {
      newProvider = {
        id: 100 + Math.floor(Math.random() * 900),
        userId: newUserId,
        name,
        companyName: `${name} Services`,
        email: normalizedEmail,
        phone,
        role: "PROVIDER",
        verificationStatus: "PENDING",
        badgeLabel: "Pending Verification",
        avatar: newUser.avatar,
        service: service || "General Home Service",
        experience: 1,
        rating: 5.0,
        reviewCount: 0,
        startingPrice: 299,
        hourlyRate: 350,
        available: true,
        bio: `Professional ${service || 'home service'} provider on TrustFix.`,
        serviceArea: serviceArea || "Mumbai Suburban",
        latitude: 19.1136,
        longitude: 72.8697,
        city: "Mumbai",
        completedJobs: 0,
        specialties: [service || "Home Repairs"],
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        workingHours: "09:00 AM - 07:00 PM",
        timeSlots: ["10:00 AM", "02:00 PM", "05:00 PM"]
      };
      newUser.providerProfileId = newProvider.id;
    }

    const token = `mock_jwt_token_${newUserId}_${Date.now()}`;
    return {
      success: true,
      user: newUser,
      providerProfile: newProvider,
      token,
      message: "Registration successful"
    };
  },

  logout: async () => {
    await delay(100);
    return { success: true };
  }
};
