import { Separator } from '@/components/ui/separator';
import { GstAndChargesForm } from './gst-and-charges-form';

const GstAndCharges = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">GST and Charges</h3>
        <p className="text-sm text-muted-foreground">
          Update your shop charges. Set shop GSt and service charges.
        </p>
      </div>
      <Separator />
      <GstAndChargesForm />
    </div>
  );
};

export default GstAndCharges;
