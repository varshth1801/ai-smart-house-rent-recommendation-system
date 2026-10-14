package com.smartrent.dto;

public class AiNaturalSearchRequest {
    private String query;

    public AiNaturalSearchRequest() {}

    public AiNaturalSearchRequest(String query) {
        this.query = query;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
