import React from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import or define the Parametres interface
interface Parametres {
  notificationsEmail: boolean;
  emailsMarketing: boolean;
}

interface PreferencesNotificationProps {
  parametres: Parametres;
  onToggle: (parametre: keyof Parametres) => void;
}

export function PreferencesNotification({ parametres, onToggle }: PreferencesNotificationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>Gérez vos paramètres de notification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-email">Notifications par email</Label>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications sur l'activité de votre compte par email.
            </p>
          </div>
          <Switch
            id="notifications-email"
            checked={parametres.notificationsEmail}
            onCheckedChange={() => onToggle('notificationsEmail')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emails-marketing">Emails marketing</Label>
            <p className="text-sm text-muted-foreground">
              Recevez des emails sur les nouvelles fonctionnalités, promotions et mises à jour.
            </p>
          </div>
          <Switch
            id="emails-marketing"
            checked={parametres.emailsMarketing}
            onCheckedChange={() => onToggle('emailsMarketing')}
          />
        </div>
      </CardContent>
    </Card>
  )
}