import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FileText, Upload } from "lucide-react";

export function UploadPrescription() {
  const { user } = useSelector((state: RootState) => state.auth);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock prescription upload
      toast({
        title: "Prescription Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const emailStatus = {
    verified: user?.isEmailVerified,
    bgColor: user?.isEmailVerified
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20",
    text: user?.isEmailVerified ? "Verified" : "Unverified",
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Prescriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload prescription documents
          </p>
          <input
            type="file"
            id="prescription-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              document.getElementById("prescription-upload")?.click()
            }
          >
            Choose File
          </Button>
        </div>

        {user?.prescriptions && user.prescriptions.length > 0 ? (
          <div className="space-y-2">
            {user.prescriptions.map((prescription, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Prescription {index + 1}
                  </span>
                </div>
                <Badge variant="secondary" className={emailStatus.bgColor}>
                  {emailStatus.text}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No prescriptions uploaded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
