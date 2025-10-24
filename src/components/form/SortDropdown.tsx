import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface SortDropdownProps {
    selectedSort: string;
    onSelectSort: (sort: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
    selectedSort,
    onSelectSort,
}) => {
    const sortOptions = [
        { label: '담은순', value: '담은순' },
        { label: '낮은가격순', value: '낮은가격순' },
        { label: '높은가격순', value: '높은가격순' },
        { label: '할인율순', value: '할인율순' },
        { label: '브랜드이름순', value: '브랜드이름순' },
    ];

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={sortOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="정렬 선택"
            value={selectedSort}
            onChange={(item) => {
                onSelectSort(item.value);
            }}
            dropdownPosition="bottom"
            containerStyle={styles.dropdownListContainer}
            itemTextStyle={styles.itemTextStyle}
            itemContainerStyle={styles.itemContainerStyle}
            activeColor="#f0f0f0"
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        width: 120,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    dropdownListContainer: {
        borderRadius: 16,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    itemContainerStyle: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4, // 16 - 12(패딩) = 4
    },
});

export default SortDropdown;