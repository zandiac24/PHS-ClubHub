// CategoryDropdown.js
'use client'
import { useState, forwardRef, useImperativeHandle } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type CategoryDropdownProps = {
  onChange?: (category: string) => void;
};

type RefType = {
  getSelectedCategory: () => string;
};


const CategoryDropdown = forwardRef<RefType, CategoryDropdownProps>((props, ref) => {
    const{ onChange } = props;
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Select Category');

    const categories = ['Activism', 'Arts', 'Business', 'Community Service', 'Culture/Identity', 'Hobbies & Games', 'Honor Societies', 'Language', 'Leadership', 'Logic', 'Non-Varsity Sports/Fitness', 'Science/Tech'];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (category: string) => {
        setSelectedCategory(category);
        setIsOpen(false);
        if (onChange) onChange(category);
    };

    useImperativeHandle(ref, () => ({
        getSelectedCategory: () => selectedCategory,
    }));

    return (
        <div className="flex">
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="flex items-center mb-[10px] justify-center rounded-md mt-[15px] bg-yellow-200 w-[230px] h-[65px] text-sm font-medium hover:bg-yellow-200"
                    onClick={toggleDropdown}
                >
                    {selectedCategory}
                    <ChevronDownIcon className="justify-right mr-[10px] w-[20px] h-[20px] ml-2" />
                </button>

                {isOpen && (
                    <div className="origin-top-right absolute
                                    left-0 mt-2 w-56 rounded-md
                                    shadow-lg bg-white ring-1 ring-black
                                    ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {categories.map((category, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block px-4 py-2
                                               text-sm text-black
                                               hover:bg-yellow-100"
                                    onClick={() => handleSelect(category)}
                                >
                                    {category}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default CategoryDropdown;
