package com.smartrent.dto;

import java.util.List;

public class PropertyComparisonRequest {
    private List<Long> propertyIds;

    public PropertyComparisonRequest() {}

    public PropertyComparisonRequest(List<Long> propertyIds) {
        this.propertyIds = propertyIds;
    }

    public List<Long> getPropertyIds() { return propertyIds; }
    public void setPropertyIds(List<Long> propertyIds) { this.propertyIds = propertyIds; }
}
