package com.trustfix.dto.mapper;

import com.trustfix.dto.category.CategoryRequest;
import com.trustfix.dto.category.CategoryResponse;
import com.trustfix.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        if (request == null) {
            return null;
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        category.setActive(request.isActive());
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIconUrl(),
                category.isActive(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
