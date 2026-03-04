# Feature: Smoke Tests - Standards-Based Barry Harris Learning
# Wave: DISTILL (5 of 6) - Deployment Validation
# Date: 2026-03-04
# Purpose: Fast post-deployment validation for production releases

# Smoke tests are FAST, CRITICAL validation checks that run after every deployment.
# They verify basic functionality without exhaustive testing.
# Goal: Detect deployment failures FAST (complete in <2 minutes).

Feature: Smoke Tests for Standards Library MVP
  As a platform engineer
  I want to validate critical functionality after deployment
  So that I can detect deployment failures before users are impacted

  Background:
    Given I have just deployed a new version to production
    And I am running smoke tests to validate deployment
    And these tests will run in <2 minutes total

  # ===========================================================================
  # BACKEND HEALTH: API Availability & Core Endpoints
  # ===========================================================================

  @smoke @backend @critical
  Scenario: Backend API is available and healthy
    Given the backend is deployed to Cloudflare Workers

    When I make a GET request to "https://api.harrisjazzlines.com/health"
    Then I should receive a 200 OK response within 5 seconds
    And the response body should contain: {"status": "healthy"}

    # Critical: If health check fails, deployment is broken
    # Action: Trigger automatic rollback

  @smoke @backend @critical
  Scenario: Standards endpoints return data
    Given I have a valid API key

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards"
    With headers:
      | X-API-Key | <valid-production-key> |
    Then I should receive a 200 OK response within 5 seconds
    And the response should be a JSON array
    And the array should contain exactly 15 standards
    And each standard should have required fields:
      | field                  |
      | id                     |
      | name                   |
      | composer               |
      | chords_improvisation   |

    # Critical: If standards endpoint fails, entire feature is broken
    # Action: Trigger automatic rollback

  @smoke @backend @critical
  Scenario: Standard by ID endpoint works
    Given I have a valid API key

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards/autumn-leaves"
    With headers:
      | X-API-Key | <valid-production-key> |
    Then I should receive a 200 OK response within 5 seconds
    And the response should be a JSON object
    And the object should have:
      | field                  | expected_value |
      | id                     | autumn-leaves  |
      | name                   | Autumn Leaves  |
      | composer               | Joseph Kosma   |

    # Critical: If detail endpoint fails, users can't access standard details
    # Action: Trigger automatic rollback

  @smoke @backend @critical
  Scenario: Line generation endpoint still works (reused endpoint)
    Given I have a valid API key
    And I have a test request for line generation

    When I make a POST request to "https://api.harrisjazzlines.com/barry-harris/generate-instructions"
    With headers:
      | X-API-Key    | <valid-production-key> |
      | Content-Type | application/json       |
    With body:
      """
      {
        "chords": ["Cm7", "F7", "BbMaj7"],
        "caged_shape": "E",
        "guitar_position": "E"
      }
      """
    Then I should receive a 200 OK response within 10 seconds
    And the response should contain a "transitions" array
    And the transitions should contain generated lines

    # Critical: If line generation fails, core feature is broken
    # Action: Trigger automatic rollback

  # ===========================================================================
  # FRONTEND HEALTH: App Loads & Core Navigation
  # ===========================================================================

  @smoke @frontend @critical
  Scenario: Frontend app loads successfully
    Given the frontend is deployed to Cloudflare Pages

    When I navigate to "https://harrisjazzlines.com"
    Then the page should load within 5 seconds
    And I should see the main navigation
    And I should see the "Experimental" tab in navigation
    And there should be no console errors
    And there should be no 404 errors for assets

    # Critical: If homepage fails to load, entire app is broken
    # Action: Trigger automatic rollback

  @smoke @frontend @critical
  Scenario: Standards Library page loads
    Given the frontend is deployed

    When I navigate to "https://harrisjazzlines.com/experimental"
    Then the page should load within 5 seconds
    And I should see the Standards Library heading
    And I should see a grid of standards (may be loading state initially)
    And there should be no console errors

    # Critical: If standards library page fails, feature is inaccessible
    # Action: Trigger automatic rollback

  @smoke @frontend @critical
  Scenario: Standard detail page loads
    Given the frontend is deployed

    When I navigate to "https://harrisjazzlines.com/experimental/standards/autumn-leaves"
    Then the page should load within 5 seconds
    And I should see "Autumn Leaves" in the page title or heading
    And I should see dual progression sections (may be loading initially)
    And I should see a "Generate Lines" button
    And there should be no console errors

    # Critical: If detail page fails, users can't generate lines
    # Action: Trigger automatic rollback

  # ===========================================================================
  # AUTHENTICATION: Security Gates Work
  # ===========================================================================

  @smoke @security @critical
  Scenario: Unauthenticated requests are blocked
    Given I do NOT have an API key

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards"
    Without the X-API-Key header
    Then I should receive a 401 Unauthorized response
    And the response should contain an error message about missing API key

    When I make a POST request to "https://api.harrisjazzlines.com/barry-harris/generate-instructions"
    Without the X-API-Key header
    Then I should receive a 401 Unauthorized response

    # Critical: If auth is broken, API is public (security risk)
    # Action: Trigger automatic rollback

  @smoke @security @critical
  Scenario: Invalid API key is rejected
    Given I have an invalid API key "invalid-key-12345"

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards"
    With headers:
      | X-API-Key | invalid-key-12345 |
    Then I should receive a 401 Unauthorized response
    And the response should contain an error message about invalid API key

    # Critical: If invalid keys are accepted, security is broken
    # Action: Trigger automatic rollback

  # ===========================================================================
  # CDN CACHING: Verify Cache Configuration
  # ===========================================================================

  @smoke @cdn @important
  Scenario: Standards endpoint is cached at edge
    Given CDN caching is enabled for standards endpoints
    And I have purged the cache before this test

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards" (first request)
    With headers:
      | X-API-Key | <valid-production-key> |
    Then I should receive a 200 OK response
    And the CF-Cache-Status header should be "MISS" or "EXPIRED"

    When I make the same request again (second request)
    Then I should receive a 200 OK response
    And the CF-Cache-Status header should be "HIT"
    And the response time should be faster than first request (<100ms)

    # Important: If caching fails, performance degrades but feature works
    # Action: Alert operations team (no automatic rollback)

  # ===========================================================================
  # RATE LIMITING: Verify Protection is Active
  # ===========================================================================

  @smoke @rate_limit @important
  Scenario: Rate limiting is enforced for line generation
    Given rate limiting is configured for 20 requests/minute
    And I have a valid API key

    When I make 20 rapid POST requests to "/barry-harris/generate-instructions"
    Then all 20 requests should succeed (200 OK)

    When I make the 21st request
    Then I should receive a 429 Too Many Requests response
    And the response should include a Retry-After header

    # Important: If rate limiting fails, abuse risk increases
    # Action: Alert security team (no automatic rollback)

  # ===========================================================================
  # ERROR HANDLING: Graceful Degradation
  # ===========================================================================

  @smoke @error_handling @important
  Scenario: 404 errors are handled gracefully
    Given I navigate to a non-existent standard

    When I make a GET request to "https://api.harrisjazzlines.com/jazz-standards/non-existent-standard"
    With headers:
      | X-API-Key | <valid-production-key> |
    Then I should receive a 404 Not Found response
    And the response should contain a user-friendly error message
    And the response should NOT contain stack traces or internal details

    # Important: Graceful error handling improves UX
    # Action: Monitor error rate, no rollback needed

  # ===========================================================================
  # SMOKE TEST EXECUTION STRATEGY
  # ===========================================================================
  #
  # Execution Order:
  # 1. Backend health (if fails, stop immediately and rollback)
  # 2. Backend critical endpoints (if fails, rollback)
  # 3. Frontend critical pages (if fails, rollback)
  # 4. Authentication (if fails, rollback)
  # 5. CDN caching (if fails, alert but continue)
  # 6. Rate limiting (if fails, alert but continue)
  # 7. Error handling (if fails, alert but continue)
  #
  # Execution Time Target: <2 minutes total
  # - Backend health: <10 seconds
  # - Backend endpoints: <30 seconds
  # - Frontend pages: <30 seconds
  # - Authentication: <20 seconds
  # - CDN caching: <20 seconds
  # - Rate limiting: <30 seconds
  # - Error handling: <10 seconds
  #
  # Automation:
  # - Run automatically in GitHub Actions after deployment
  # - Run on demand via `/nw:smoke-test` command
  # - Run on schedule (every 6 hours) for ongoing health monitoring
  #
  # Failure Actions:
  # - CRITICAL failures: Trigger automatic rollback + alert
  # - IMPORTANT failures: Alert operations team, no rollback
  # - All failures: Create incident report for investigation
  #
  # Success Criteria:
  # - All CRITICAL tests pass (9 scenarios)
  # - At least 80% of IMPORTANT tests pass (3/4 scenarios)
  # - Total execution time <2 minutes
  # - Zero production incidents caused by missed smoke test coverage
  #
  # Test Data Management:
  # - Use production API keys (stored in GitHub Secrets)
  # - Use read-only operations where possible
  # - Clean up any test data created (rate limit test uses real API)
  # - Monitor test impact on production metrics (should be negligible)
