import { Separator } from '@/components/ui/separator';
import { DeliverySettingsForm } from './delivery-settings-form';

const Delivery = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Delivery</h3>
        <p className="text-sm text-muted-foreground">
          Update your shop delivery settings.
        </p>
      </div>
      <Separator />
      <DeliverySettingsForm />
    </div>
  );
};

export default Delivery;
