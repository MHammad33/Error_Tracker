# Contributing to Issue Tracker

Thank you for your interest in contributing to the Issue Tracker project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Git
- MongoDB database access
- Google OAuth credentials (for testing auth features)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/issue-tracker.git
   cd issue-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any` types
- **Components**: Functional components with hooks
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **File Structure**: Group related files in directories
- **Imports**: Use absolute imports with `@/` prefix

### Code Formatting

We use ESLint and Prettier for consistent code formatting:

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Component Guidelines

```typescript
// Good: Typed props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'primary', children, onClick }: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Good: Export with default
export default Button;
```

### API Route Guidelines

```typescript
// Good: Proper error handling and types
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const data = await prisma.issue.findMany();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### Database Guidelines

- Always use Prisma for database operations
- Use transactions for multi-step operations
- Include proper error handling
- Use typed Prisma client methods

```typescript
// Good: Proper Prisma usage
const updateIssueWithHistory = await prisma.$transaction(async (tx) => {
  const updatedIssue = await tx.issue.update({
    where: { id },
    data: { status },
  });

  await tx.issueHistory.create({
    data: {
      issueId: id,
      action: 'STATUS_CHANGED',
      oldValue: previousStatus,
      newValue: status,
    },
  });

  return updatedIssue;
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.0.0]

**Additional context**
Any other context about the problem.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context, mockups, or examples.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow coding guidelines
   - Add tests if applicable
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run build
   npm run test # if tests exist
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Pull Request Guidelines

- **Title**: Use descriptive titles following [Conventional Commits](https://conventionalcommits.org/)
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Clearly document any breaking changes

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

## 🧪 Testing Guidelines

### Manual Testing

Before submitting a PR, please test:

1. **Authentication Flow**
   - Login/logout works
   - Protected routes are secured
   - User sessions persist correctly

2. **Issue Management**
   - Create, read, update, delete operations
   - Status changes work correctly
   - Assignment functionality works

3. **UI/UX Testing**
   - Responsive design on different screen sizes
   - All interactive elements work
   - Loading states display correctly
   - Error states are handled gracefully

4. **Performance Testing**
   - Large datasets load efficiently
   - Virtual scrolling works with many items
   - No memory leaks in long sessions

### Browser Testing

Test your changes in:
- Chrome (latest)
- Firefox (latest)
- Safari (if on macOS)
- Edge (latest)

## 📦 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 📞 Getting Help

### Questions?

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: For security-related issues

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- **Performance Optimizations**: Virtual scrolling improvements
- **Accessibility**: Screen reader support, keyboard navigation
- **Mobile Experience**: Touch interactions, responsive design
- **Error Handling**: Better error messages and recovery

### Medium Priority
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: API docs, component documentation
- **Internationalization**: Multi-language support
- **Security**: Security audits, vulnerability fixes

### Nice to Have
- **Themes**: Dark mode improvements, custom themes
- **Animations**: Smooth transitions and micro-interactions
- **PWA Features**: Offline support, push notifications
- **Integrations**: Third-party service integrations

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graph
- Special thanks in major releases

Thank you for contributing to Issue Tracker! 🎉
