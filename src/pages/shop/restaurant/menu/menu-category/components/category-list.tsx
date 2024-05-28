import React from 'react';
import { IMenuCategory } from '@/models/menu';
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
import {
  MdOutlineDeleteOutline,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdModeEditOutline,
} from 'react-icons/md';

interface ICategoryListProps {
  data: IMenuCategory[];
  onEditClick: (id: string) => void;
}
const CategoryList: React.FC<ICategoryListProps> = ({ data, onEditClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Display Index</TableHead>
          <TableHead className="hidden sm:table-cell">Category Name</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data
          .sort((a, b) => a.displayIndex - b.displayIndex)
          .map((category) => {
            return (
              <TableRow key={category.id} className={`text-xs 2xl:text-sm`}>
                <TableCell className="hidden sm:table-cell">
                  {category.displayIndex}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {category.categoryName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {category.isActive ? (
                    <Badge variant="secondary">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex gap-2 justify-end">
                    <Button variant={'outline'} size={'icon'}>
                      <MdKeyboardArrowUp />
                    </Button>
                    <Button variant={'outline'} size={'icon'}>
                      <MdKeyboardArrowDown />
                    </Button>
                    <Button
                      variant={'outline'}
                      size={'icon'}
                      onClick={() => {
                        onEditClick(category.id);
                      }}
                    >
                      <MdModeEditOutline />
                    </Button>
                    <Button variant={'outline'} size={'icon'}>
                      <MdOutlineDeleteOutline />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default CategoryList;
