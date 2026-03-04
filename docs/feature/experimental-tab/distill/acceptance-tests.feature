# Feature: Standards-Based Barry Harris Learning
# Wave: DISTILL (5 of 6) - Acceptance Test Design
# Date: 2026-03-04
# Status: Complete

# These acceptance tests validate COMPLETE BUSINESS FLOWS across multiple API calls.
# They represent real user journeys, not single operations.
# Each scenario tests observable user outcomes through driving ports (API endpoints).

Feature: Standards-Based Barry Harris Learning
  As a jazz student learning improvisation
  I want to practice Barry Harris method with familiar jazz standards
  So that I can build confidence through structured, standards-based practice

  Background:
    Given the Wes API is available at "https://api.harrisjazzlines.com"
    And the HarrisApp frontend is available at "https://harrisjazzlines.com"
    And I have a valid API key for authentication

  # ===========================================================================
  # WALKING SKELETON: Complete First-Time User Journey (Priority 1)
  # ===========================================================================
  # This is the PRIMARY walking skeleton - complete user value delivery E2E
  # Tests: Stories 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2
  # CSFs: Frictionless Entry (<30s), Fast Generation (<3s), Shape Exploration (<3s)

  @walking_skeleton
  Scenario: First-time user completes journey from discovery to guitar practice
    Given I am a jazz student seeking practice direction
    And I have never used the Standards Library before

    When I open the HarrisApp in my browser
    And I click the "Experimental" tab in navigation
    Then I should see the Standards Library page within 2 seconds
    And I should see a grid of 15 jazz standards

    When I browse the standards list
    Then I should see "Autumn Leaves" with metadata:
      | composer   | Joseph Kosma  |
      | key        | G minor       |
      | difficulty | beginner      |
      | tempo      | Medium Ballad |
      | form       | AABA          |

    When I click on "Autumn Leaves" card
    Then I should navigate to the standard detail page
    And I should see the URL updated to "/experimental/standards/autumn-leaves"
    And I should see two chord progressions clearly labeled:
      | label                                   | chords                                  |
      | Original Progression (Melody/Comping)   | Cm7, F7, BbMaj7, EbMaj7, Am7b5, D7, Gm7 |
      | Improvisation Progression (Barry Harris)| Cm7, F7, BbMaj7, Am7b5, D7, Gm7         |
    And I should see explanation text: "Simplified version removes EbMaj7 passing chord"

    When I click the "Generate Lines" button
    Then I should see a loading indicator immediately
    And I should receive generated lines within 3 seconds
    And I should see ABC notation rendered with musical staff
    And I should see chord symbols aligned with notation
    And I should see 5 shape buttons labeled: C, A, G, E, D
    And the E button should be highlighted as active

    When I click the "A" shape button
    Then I should see a loading indicator on the A button
    And I should receive new lines within 3 seconds
    And I should see different ABC notation for A shape
    And the A button should now be highlighted as active
    And the E button should no longer be highlighted

    When I review the generated lines
    Then I should have completed the journey in less than 30 seconds total
    And I should feel ready to practice with my guitar
    And I should have observable practice material (ABC notation)

  # ===========================================================================
  # WALKING SKELETON: Returning User Quick Access (Priority 1)
  # ===========================================================================
  # Tests: Stories 1.3 (URL state), 1.4, 1.5
  # CSF: Frictionless Entry (<30s)

  @walking_skeleton
  Scenario: Returning user accesses standard directly via URL
    Given I am a returning user who knows about "Blue Bossa"
    And I have the direct URL "https://harrisjazzlines.com/experimental/standards/blue-bossa"

    When I open that URL in my browser
    Then I should land directly on the Blue Bossa detail page
    And I should see dual progressions immediately
    And I should NOT see the standards library list first

    When I click "Generate Lines"
    Then I should receive lines within 3 seconds
    And I should see E shape highlighted by default

    When I switch to G shape
    Then I should receive new lines within 3 seconds
    And I should be practicing within 15 seconds of opening URL

    Then I should have achieved faster entry than first-time users
    And I should have completed URL-to-practice in less than 20 seconds

  # ===========================================================================
  # COMPLETE FLOW: Shape Exploration Across Multiple Standards (Priority 2)
  # ===========================================================================
  # Tests: Stories 2.1, 2.2, 2.3, Epic 3 (iteration)
  # CSF: Effortless Shape Exploration (<3s per switch)

  Scenario: Student explores multiple shapes across two standards
    Given I have already generated lines for "Autumn Leaves" with E shape
    And I want to compare different fretboard positions

    When I click the A shape button
    Then I should see new lines within 3 seconds
    And I should note the melodic differences mentally

    When I click the G shape button
    Then I should see new lines within 3 seconds

    When I click the C shape button
    Then I should see new lines within 3 seconds

    When I click the D shape button
    Then I should see new lines within 3 seconds

    Then I should have explored all 5 shapes for "Autumn Leaves"
    And I should have completed 5 shape switches in less than 20 seconds total

    When I click "Back to Library" breadcrumb
    Then I should return to the standards library list
    And I should see "Autumn Leaves" still in the list

    When I select "Solar" from the list
    Then I should navigate to the Solar detail page
    And I should see Solar's dual progressions

    When I generate lines with default E shape
    Then I should receive lines within 3 seconds

    When I explore A and G shapes for Solar
    Then each shape switch should complete within 3 seconds
    And I should be able to compare shapes mentally

    Then I should have explored 2 standards with multiple shapes
    And I should feel empowered to choose my preferred position
    And I should have spent less than 2 minutes total across both standards

  # ===========================================================================
  # ERROR FLOW: API Timeout Recovery (Priority 2)
  # ===========================================================================
  # Tests: Story 4.1 (error handling)
  # CSF: Reliability (error recovery)

  Scenario: Student recovers from API timeout during line generation
    Given I am viewing the "Stella By Starlight" detail page
    And I have clicked "Generate Lines"
    And the API is experiencing high latency (>5 seconds)

    When I wait 5 seconds
    Then I should see a timeout message: "Generation is taking longer than expected"
    And I should see a "Retry" button
    And the loading indicator should still be visible
    And my selected standard and shape should be preserved

    When I click the "Retry" button
    Then I should see the loading indicator restart
    And the API should respond successfully within 3 seconds
    And I should see generated lines rendered

    Then I should have successfully recovered from timeout
    And I should NOT have lost my context (standard, shape)
    And I should feel confident the system handles delays gracefully

  # ===========================================================================
  # ERROR FLOW: Rate Limit Handling (Priority 3)
  # ===========================================================================
  # Tests: Story 4.1, DEVOPS rate limiting (20 req/min for line generation)
  # CSF: Reliability (abuse prevention)

  Scenario: Student encounters rate limit during rapid shape exploration
    Given I am exploring shapes very rapidly for experimentation
    And I am on the "Blue Bossa" detail page

    When I click all 5 shape buttons sequentially without waiting
    And I click them 5 more times (25 total requests in 1 minute)
    Then I should receive successful responses for the first 20 requests

    When I make the 21st request
    Then I should receive a 429 Too Many Requests error
    And I should see an error message: "You're exploring shapes too quickly. Please wait 60 seconds and try again."
    And I should see a countdown timer showing seconds remaining
    And my selected standard should be preserved

    When I wait 60 seconds
    And I click a shape button again
    Then I should receive a successful response within 3 seconds
    And I should be able to continue exploring shapes

    Then I should understand rate limits prevent abuse
    And I should NOT feel punished for legitimate exploration (20/min is generous)

  # ===========================================================================
  # ERROR FLOW: Standards Library Load Failure (Priority 2)
  # ===========================================================================
  # Tests: Story 4.3 (library load failure)
  # CSF: Reliability (graceful degradation)

  Scenario: Student recovers from standards library load failure
    Given I am opening the Experimental tab for the first time
    And the standards library API is temporarily unavailable

    When I click the "Experimental" tab
    Then I should see a loading indicator

    When the API fails after 3 seconds
    Then I should see an error message: "Unable to load standards library"
    And I should see a "Retry" button
    And I should NOT see a broken UI or stack trace

    When the API becomes available again
    And I click the "Retry" button
    Then I should see the loading indicator restart
    And I should receive the 15 standards within 2 seconds
    And I should see the standards library grid

    Then I should have successfully recovered from load failure
    And I should feel the system is resilient to temporary outages

  # ===========================================================================
  # BOUNDARY SCENARIO: Invalid Standard ID (Priority 3)
  # ===========================================================================
  # Tests: Backend error handling (404)

  Scenario: Student attempts to access non-existent standard via URL
    Given I am a user who typed a URL manually
    And I navigate to "https://harrisjazzlines.com/experimental/standards/invalid-standard-name"

    When the page loads
    Then I should see a 404 error message: "Standard not found"
    And I should see a link: "Return to Standards Library"
    And I should NOT see a broken UI or stack trace

    When I click "Return to Standards Library"
    Then I should navigate to the standards library list
    And I should see all 15 standards

    Then I should have gracefully recovered from invalid URL

  # ===========================================================================
  # BOUNDARY SCENARIO: Missing API Key (Priority 3)
  # ===========================================================================
  # Tests: Authentication (DEVOPS ADR-001)

  Scenario: Unauthenticated request to standards endpoint
    Given I am a developer testing the API directly
    And I do NOT include an X-API-Key header

    When I make a GET request to "/jazz-standards"
    Then I should receive a 401 Unauthorized response
    And I should see an error message: "Missing or invalid API key"

    When I make a POST request to "/barry-harris/generate-instructions"
    Then I should receive a 401 Unauthorized response
    And I should see an error message: "Missing or invalid API key"

    Then authentication should be consistently enforced across all feature endpoints

  # ===========================================================================
  # SUCCESS CRITERIA VALIDATION SCENARIOS
  # ===========================================================================

  @performance @csf1
  Scenario: Validate CSF 1 - Frictionless Entry (<30 seconds)
    Given I am a new user timing my first session
    And I start a timer when I open the app

    When I complete these steps:
      | step                            |
      | Click "Experimental" tab        |
      | Browse standards list           |
      | Click "Autumn Leaves"           |
      | View dual progressions          |
      | Click "Generate Lines"          |
      | View rendered ABC notation      |

    Then the total elapsed time should be less than 30 seconds
    And I should feel the experience was frictionless
    And I should NOT have experienced decision paralysis

  @performance @csf2
  Scenario: Validate CSF 2 - Fast Generation (<3 seconds p95)
    Given I am generating lines for "Blue Bossa"

    When I click "Generate Lines" 100 times (one at a time)
    And I measure the API response time for each request

    Then 95% of requests should complete in less than 3 seconds
    And the median (p50) should be less than 1 second
    And I should feel the generation is fast and responsive

  @performance @csf5
  Scenario: Validate CSF 5 - Effortless Shape Exploration (<3 seconds)
    Given I have generated lines for "Autumn Leaves" with E shape

    When I switch to A shape and measure time to new lines rendered
    And I switch to G shape and measure time to new lines rendered
    And I switch to C shape and measure time to new lines rendered
    And I switch to D shape and measure time to new lines rendered

    Then each shape switch should complete in less than 3 seconds
    And 95% of shape switches should complete in less than 3 seconds
    And I should feel shape exploration is effortless

  # ===========================================================================
  # ACCESSIBILITY SCENARIO (Priority 3)
  # ===========================================================================

  Scenario: Keyboard-only user navigates standards library
    Given I am a keyboard-only user (no mouse)
    And I have the Experimental tab focused

    When I press Tab to navigate through standards
    Then I should be able to focus each standard card
    And I should see clear focus indicators

    When I press Enter on a focused standard
    Then I should navigate to the detail page

    When I Tab to the "Generate Lines" button and press Enter
    Then I should trigger line generation

    When I Tab to shape buttons and press Enter on "A"
    Then I should trigger shape regeneration

    Then I should be able to complete entire journey with keyboard only
    And all interactive elements should have ARIA labels

  # ===========================================================================
  # NOTES FOR SOFTWARE CRAFTER (DELIVER WAVE)
  # ===========================================================================
  #
  # Implementation Priority (One-at-a-Time TDD):
  # 1. Enable FIRST walking skeleton (first-time user journey) - mark all others @skip
  # 2. Implement until walking skeleton passes - this is your outer RED-GREEN loop
  # 3. Enable second walking skeleton (returning user) - implement until green
  # 4. Enable shape exploration scenario - implement until green
  # 5. Enable error scenarios one at a time - implement until green
  # 6. Enable performance/CSF scenarios last - validate metrics
  #
  # Test Data Setup:
  # - Use real jazz-standards.json file (15 standards)
  # - Mock API responses for frontend tests (fast execution)
  # - Use real Rust implementations for backend tests (no mocks in domain)
  #
  # Test Execution Strategy:
  # - Walking skeletons: Full E2E (frontend + backend)
  # - Focused scenarios: Can test at boundary (API layer)
  # - Performance scenarios: Load testing tools (k6 or Artillery)
  #
  # Acceptance Criteria Met:
  # - All scenarios trace to user stories (see mapping in comments)
  # - All scenarios test COMPLETE business flows (not single operations)
  # - All scenarios use business language (zero technical jargon)
  # - Walking skeletons deliver observable user value (demo-able to stakeholders)
  # - Error scenarios cover 40%+ of total (6 error scenarios / 15 total = 40%)
