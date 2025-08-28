# Taskify - Advanced Todo List & Note Manager

A modern, full-featured task management and note-taking application built with Next.js 14+, Supabase, and TypeScript. Taskify combines powerful todo list functionality with rich note-taking capabilities in a beautiful, responsive interface.

## 🌟 Features

### Task Management
- ✅ Create, edit, delete, and organize tasks
- 📊 Task status tracking (Pending, In Progress, Completed)
- 🎯 Priority levels (High, Medium, Low)
- 📁 Category organization
- 📅 Due date management
- 🔍 Advanced search and filtering
- 📈 Real-time task statistics

### Note Taking
- 📝 Rich text note creation and editing
- 🏷️ Tag-based organization system
- 📌 Pin important notes
- 🔍 Full-text search across all notes
- 📊 Note statistics and management
- 💾 Auto-save functionality

### Unified Experience
- 🔍 Global search across tasks and notes
- 🎨 Beautiful, responsive design
- 🌙 Dark/Light theme support
- 👤 Guest mode with localStorage
- 🔐 Secure authentication with Supabase
- 📱 Mobile-friendly interface
- ⚡ Real-time updates

### Authentication & Data
- 🔐 Email/password authentication
- 🌐 Google OAuth integration
- 👤 Guest mode for quick access
- ☁️ Cloud sync with Supabase
- 💾 Local storage fallback
- 🔒 Row-level security

## 🎨 Design System

### Colors
- **Primary**: #fb5495 (Pink) - Used for buttons, accents, and highlights
- **Secondary**: #5184ff (Blue) - Used for secondary elements and links
- **Theme**: Supports both light and dark modes with automatic system detection

### Typography
- Clean, modern font stack with proper hierarchy
- Automatic capitalization for titles and descriptions
- Responsive text sizing across devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for cloud features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Follow the instructions in `database-setup.md` to set up your Supabase database.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
taskify/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Task management
│   │   ├── notes/             # Note management
│   │   ├── search/            # Unified search
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   ├── notes/             # Note components
│   │   ├── shared/            # Shared components
│   │   ├── tasks/             # Task components
│   │   └── ui/                # UI components
│   └── lib/                   # Utilities and services
│       ├── database.ts        # Database operations
│       ├── supabase.ts        # Supabase configuration
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── database-setup.md          # Database setup instructions
└── README.md                  # This file
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `database-setup.md`
3. Configure authentication providers (optional)
4. Update environment variables

### Guest Mode

The application supports guest mode for users who want to try the app without creating an account:
- Data stored in localStorage
- Full functionality available
- Easy migration to cloud storage

## 🎯 Usage

### Task Management

1. **Creating Tasks**
   - Click "New Task" button
   - Fill in title, description, category, priority, and due date
   - Save to add to your task list

2. **Managing Tasks**
   - Change status by clicking status buttons
   - Edit tasks by clicking the "Edit" button
   - Delete tasks with confirmation
   - Filter by status, category, or priority

3. **Search Tasks**
   - Use the search bar to find tasks by title or description
   - Apply filters for refined results

### Note Taking

1. **Creating Notes**
   - Click "New Note" button
   - Add title, content, and tags
   - Pin important notes for easy access

2. **Organizing Notes**
   - Use tags for categorization
   - Pin frequently accessed notes
   - Search by content or tags

3. **Managing Notes**
   - Edit notes inline
   - Delete with confirmation
   - Filter by tags or search terms

### Unified Search

- Access global search from the navigation
- Search across both tasks and notes
- Results ranked by relevance
- Click results to navigate directly

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React hooks and context
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel-ready

## 🔐 Security

- Row-level security (RLS) enabled on all tables
- User data isolation
- Secure authentication flows
- Environment variable protection
- Input validation and sanitization

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized navigation
- Progressive Web App (PWA) ready

## 🎨 Customization

### Themes
- Built-in dark/light mode toggle
- System preference detection
- Persistent theme selection

### Colors
- Easily customizable color scheme
- CSS custom properties
- Consistent design tokens

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- shadcn/ui for the beautiful components
- Tailwind CSS for the styling system

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js and Supabase**
