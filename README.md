# OpCa Admin Panel

OpCa Admin Panel is a modern web application designed to manage and monitor the OpCa Veterinary Diagnostic Tool. This admin interface provides comprehensive control over user management, diagnostic data analysis, and system configurations.

## Features

### Dashboard Analytics
- Real-time statistics of parasitic diagnoses
- User activity monitoring
- System performance metrics
- Daily/weekly/monthly diagnosis trends

### User Management
- Veterinarian account administration
- Role-based access control
- User activity logs
- Profile management

### Diagnostic Data Management
- View and analyze diagnostic results
- Filter and search through diagnoses history
- Export diagnostic data reports
- Manage AI model configurations

### System Configuration
- Application settings management
- Language preferences
- Email notification settings
- System maintenance tools

## Technical Stack

- **Frontend Framework**: Next.js 13
- **UI Components**: Material-UI (MUI)
- **State Management**: Redux
- **Authentication**: JWT
- **API Integration**: RESTful APIs
- **Styling**: Emotion
- **Charts**: ApexCharts
- **Forms**: React Hook Form

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/opca-admin.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── @core/            # Core components and utilities
├── configs/          # Configuration files
├── layouts/          # Layout components
├── navigation/       # Navigation configuration
├── pages/           # Page components
├── store/           # Redux store setup
└── views/           # Reusable view components
```

## Main Features Details

### Dashboard
- Overview of system statistics
- Active users monitoring
- Recent diagnoses
- System health status

### User Management
- Create and manage veterinarian accounts
- Assign and modify user roles
- Monitor user activities
- Reset passwords and manage access

### Diagnostic Management
- View detailed diagnosis reports
- Filter diagnoses by date, veterinarian, or result
- Export data in various formats
- Manage AI model settings

### Settings
- System configuration
- Email templates
- Notification preferences
- Security settings

## Security

- JWT-based authentication
- Role-based access control
- Session management
- API request validation
- XSS protection
- CSRF protection

## API Integration

The admin panel integrates with the OpCa mobile app's backend through RESTful APIs:

- User authentication and authorization
- Diagnostic data retrieval and management
- System configuration
- Report generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Related Projects

- [OpCa Mobile App](https://github.com/ihoflaz/OpCa) - iOS mobile application for veterinary diagnostics
- [OpCa API](https://github.com/ihoflaz/OpCa) - Backend API service

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

İbrahim Hulusi Oflaz - [contact@example.com](mailto:contact@example.com)

Project Link: [https://github.com/ihoflaz/OpCa](https://github.com/ihoflaz/OpCa) 