import React from 'react';
import { Box, Button, Container } from '@mui/material';
import useCategories from '../../hooks/useCategories';

const CategoryNav = ({ onCategorySelect, selectedCategory }) => {
    const { categories, loading } = useCategories();

    if (loading) return null;

    return (
        <Box
            sx={{
                backgroundColor: '#f5f1e8',
                py: 3,
                mb: 0,
                borderBottom: '1px solid #e0d5c7',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        variant={selectedCategory === null ? 'contained' : 'text'}
                        onClick={() => onCategorySelect(null)}
                        sx={{
                            backgroundColor: selectedCategory === null ? '#2c2c2c' : 'transparent',
                            color: selectedCategory === null ? '#f5f1e8' : '#2c2c2c',
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            letterSpacing: '0.1em',
                            px: 3,
                            py: 1,
                            minWidth: 100,
                            borderRadius: 0,
                            '&:hover': {
                                backgroundColor: selectedCategory === null ? '#1a1a1a' : '#e8dcc8',
                            },
                        }}
                    >
                        ALL
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'contained' : 'text'}
                            onClick={() => onCategorySelect(category.id)}
                            sx={{
                                backgroundColor: selectedCategory === category.id ? '#2c2c2c' : 'transparent',
                                color: selectedCategory === category.id ? '#f5f1e8' : '#2c2c2c',
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                letterSpacing: '0.1em',
                                px: 3,
                                py: 1,
                                minWidth: 100,
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: selectedCategory === category.id ? '#1a1a1a' : '#e8dcc8',
                                },
                            }}
                        >
                            {category.name.toUpperCase()}
                        </Button>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default CategoryNav;