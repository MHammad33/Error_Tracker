import { Heading, Text, Card } from "@radix-ui/themes";
import { Metadata } from "next";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading size="7" className="text-gray-900 mb-2">
          Settings
        </Heading>
        <Text size="3" className="text-gray-600">
          Manage your account and application preferences.
        </Text>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Profile Settings
          </Heading>
          <Text size="3" className="text-gray-600">
            Update your personal information and preferences.
          </Text>
        </Card>

        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Notifications
          </Heading>
          <Text size="3" className="text-gray-600">
            Configure how you receive notifications about issues.
          </Text>
        </Card>

        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Team Management
          </Heading>
          <Text size="3" className="text-gray-600">
            Manage team members and their permissions.
          </Text>
        </Card>

        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Issue Templates
          </Heading>
          <Text size="3" className="text-gray-600">
            Create templates for common issue types.
          </Text>
        </Card>

        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Integrations
          </Heading>
          <Text size="3" className="text-gray-600">
            Connect with external tools and services.
          </Text>
        </Card>

        <Card className="p-6 shadow-sm border border-gray-200">
          <Heading size="4" className="text-gray-900 mb-3">
            Data Export
          </Heading>
          <Text size="3" className="text-gray-600">
            Export your data in various formats.
          </Text>
        </Card>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Settings",
  description: "Manage your account and application settings",
};
