package com.smartrent.dto;

import java.util.ArrayList;
import java.util.List;

public class PricePredictionResponse {
    private Double estimatedRent;
    private Double confidenceLow;
    private Double confidenceHigh;
    private Double pricePerSqft;
    private String marketTrend; // "HOT_MARKET", "BALANCED", "TENANT_FAVORABLE"
    private Double rentalYieldEstimate;
    private List<String> contributingFactors = new ArrayList<>();
    private String valuationSummary;

    public PricePredictionResponse() {}

    public Double getEstimatedRent() { return estimatedRent; }
    public void setEstimatedRent(Double estimatedRent) { this.estimatedRent = estimatedRent; }

    public Double getConfidenceLow() { return confidenceLow; }
    public void setConfidenceLow(Double confidenceLow) { this.confidenceLow = confidenceLow; }

    public Double getConfidenceHigh() { return confidenceHigh; }
    public void setConfidenceHigh(Double confidenceHigh) { this.confidenceHigh = confidenceHigh; }

    public Double getPricePerSqft() { return pricePerSqft; }
    public void setPricePerSqft(Double pricePerSqft) { this.pricePerSqft = pricePerSqft; }

    public String getMarketTrend() { return marketTrend; }
    public void setMarketTrend(String marketTrend) { this.marketTrend = marketTrend; }

    public Double getRentalYieldEstimate() { return rentalYieldEstimate; }
    public void setRentalYieldEstimate(Double rentalYieldEstimate) { this.rentalYieldEstimate = rentalYieldEstimate; }

    public List<String> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }

    public String getValuationSummary() { return valuationSummary; }
    public void setValuationSummary(String valuationSummary) { this.valuationSummary = valuationSummary; }
}
