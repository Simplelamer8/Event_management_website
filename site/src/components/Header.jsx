import React, { useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { addMonths, format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import styles from "./Header.module.css"

export default function Header({fetchMoreData, inputValue, handleInputChange, sortBasedOnDates, selectedIndex, selectedIndex2, setSelectedIndex, setSelectedIndex2, options, options2, navigate}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const [anchorEl2, setAnchorEl2] = useState(null);
    const open2 = Boolean(anchorEl2);


    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log("Close");
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, index) => 
    {
        if (index > selectedIndex2)
        {
            alert("Первая дата должна быть раньше второй");
            return;
        }

        // The implementation of Sort based on dates
        sortBasedOnDates(options, index, selectedIndex2);

        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClickListItem2 = (event) => 
    {
        setAnchorEl2(event.currentTarget);
    };

    const handleClose2 = () => 
    {
        setAnchorEl2(null);
    };

    const handleMenuItemClick2 = (event, index) => 
    {
        if (index < selectedIndex)
        {
            alert("Вторая дата должна быть позднее первой");
            return;
        }

        // The implementation of Sort based on dates
        sortBasedOnDates(options, selectedIndex, index);
        
        setSelectedIndex2(index);
        setAnchorEl2(null);
    };

  return (
    <div className={styles.header}>
        <ul>
            <li>
                <List
                    component="nav"
                    aria-label="Device settings"
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                    >
                        <ListItemText
                            primary="Start date"
                            secondary={options[selectedIndex]}
                        />
                    </ListItemButton>
                </List>
                <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                    className: styles.menuVertical
                }}
                >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        disabled={index === selectedIndex}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))
                }
                </Menu>
            </li>
            
            <li>
                <List
                    component="nav"
                    aria-label="Device settings"
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem2}
                    >
                        <ListItemText
                            primary="End date"
                            secondary={options2[selectedIndex2]}
                        />
                    </ListItemButton>
                </List>
                <Menu
                id="lock-menu"
                anchorEl={anchorEl2}
                open={open2}
                onClose={handleClose2}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                    className: styles.menuVertical
                }}
                >
                {options2.map((option, index) => (
                    <MenuItem
                        key={option}
                        disabled={index === selectedIndex}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick2(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))
                }
                </Menu>
            </li>
            <li>
                <form action="">
                    <input type="search" placeholder='Type to search...' value={inputValue} onChange={handleInputChange}/>
                </form>
            </li>
            <li>
                <button onClick={fetchMoreData}>Get More Cards!</button>
            </li>
            <li>
                <button onClick={() => navigate("login")}>Login/Register</button>
            </li>
        </ul>
    </div>
  )
}
