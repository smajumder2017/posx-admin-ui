import { Separator } from '@/components/ui/separator';
import { ShopDetailsForm } from './shop-details-form';

const ShopDetails = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Shop Details</h3>
        <p className="text-sm text-muted-foreground">
          Update your shop details. Set shop address and location.
        </p>
      </div>
      <Separator />
      <ShopDetailsForm />
    </div>
  );
};

export default ShopDetails;
