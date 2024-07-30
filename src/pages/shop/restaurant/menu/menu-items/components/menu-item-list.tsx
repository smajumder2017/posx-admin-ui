import React from 'react';
import { IMenuItem } from '@/models/menu';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/custom/button';
import { MdOutlineDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import { formatPrice } from '@/utils/currency';

import { FaPepperHot } from 'react-icons/fa';
import { BiFoodTag } from 'react-icons/bi';
import { Food_Type, Spice_Scale } from '@/utils/enums';

export const SpiceLevel: React.FC<
  React.PropsWithChildren<{ level: number; total: number }>
> = (props) => {
  const levels = Array.from(Array(props.total));

  return (
    <div className="flex">
      {levels.map((_item, index) => {
        if (index < props.level) {
          return <FaPepperHot key={index} className={'text-red-400'} />;
        } else {
          return <FaPepperHot key={index} className={'text-gray-300'} />;
        }
      })}
    </div>
  );
};

interface IMenuItemListProps {
  data: IMenuItem[];
  onEditClick?: (id: string) => void;
}
const MenuItemList: React.FC<IMenuItemListProps> = ({ data, onEditClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="hidden sm:table-cell">Description</TableHead>
          <TableHead className="hidden sm:table-cell">Short Code</TableHead>
          <TableHead className="hidden sm:table-cell">Categeory</TableHead>
          <TableHead className="hidden md:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">Spice Scale</TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">
            Online Delivery Price
          </TableHead>
          <TableHead className="hidden md:table-cell">Availability</TableHead>
          <TableHead className="hidden md:table-cell text-center">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => {
          const spiceIndex =
            item.spiceScale === Spice_Scale.None
              ? 0
              : item.spiceScale === Spice_Scale.Mild
                ? 1
                : item.spiceScale === Spice_Scale.Moderate
                  ? 2
                  : 3;
          const foodTypeColorClass =
            item.foodType === Food_Type.Vegetarian
              ? 'text-green-500'
              : item.foodType === Food_Type.NonVegetarian
                ? 'text-red-500'
                : 'text-blue-500';
          const foodType =
            item.foodType === Food_Type.Vegetarian
              ? 'Veg'
              : item.foodType === Food_Type.NonVegetarian
                ? 'Non-Veg'
                : 'Vegan';
          return (
            <TableRow key={item.id} className={`text-xs 2xl:text-sm`}>
              <TableCell className="hidden sm:table-cell">
                {item.itemName}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="max-w-32 truncate sm:max-w-72 md:max-w-[31rem]">
                  {item.description}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline">{item.shortCode}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">{item.category?.categoryName}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className="gap-1">
                  <BiFoodTag className={foodTypeColorClass} />
                  {foodType}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <SpiceLevel total={3} level={spiceIndex} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatPrice(item.price)}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatPrice(item.onlineDeliveryPrice)}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {item.availability ? 'Available' : 'Not Avialable'}
              </TableCell>
              <TableCell className="flex justify-center gap-1">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  onClick={() => {
                    onEditClick?.(item.id);
                  }}
                >
                  <MdModeEditOutline />
                </Button>
                <Button variant={'outline'} size={'icon'}>
                  <MdOutlineDeleteOutline />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default MenuItemList;
