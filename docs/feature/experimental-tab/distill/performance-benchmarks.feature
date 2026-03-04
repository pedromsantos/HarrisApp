# Feature: Performance Benchmarks - Standards-Based Barry Harris Learning
# Wave: DISTILL (5 of 6) - Performance Test Design
# Date: 2026-03-04
# Purpose: Quantitative validation of Critical Success Factors (CSFs)

# These scenarios validate performance targets with MEASURABLE acceptance criteria.
# Each scenario maps to a specific CSF from the DEVOPS wave.
# Tests run against production-like environment to validate real-world performance.

Feature: Performance Benchmarks for Standards Library MVP
  As a platform architect
  I want to validate all CSF performance targets
  So that the MVP meets quantitative success criteria before launch

  Background:
    Given the backend API is deployed to Cloudflare Workers at "https://api.harrisjazzlines.com"
    And the frontend is deployed to Cloudflare Pages at "https://harrisjazzlines.com"
    And CDN caching is configured per DEVOPS wave specifications
    And I have performance monitoring tools configured

  # ===========================================================================
  # CSF 1: FRICTIONLESS ENTRY (<30 seconds)
  # ===========================================================================
  # Target: User completes journey from app open to first line generation in <30s
  # Measurement: Manual user testing with 5 real users
  # Success: 100% of users complete in <30 seconds

  @performance @csf1 @manual
  Scenario: Validate frictionless entry with real users
    Given I have recruited 5 jazz students who have never used the app
    And I have provided them with the task: "Generate Barry Harris lines for any jazz standard"
    And I have started a timer for each user

    When each user opens the app independently
    And navigates to the Standards Library
    And selects any standard
    And clicks "Generate Lines"
    And views the rendered ABC notation

    Then I should record the elapsed time for each user
    And 100% of users should complete the journey in less than 30 seconds
    And the average time should be less than 20 seconds
    And users should report "no confusion" in post-test survey

    # Quantitative Acceptance Criteria:
    # - User 1 time: <30s
    # - User 2 time: <30s
    # - User 3 time: <30s
    # - User 4 time: <30s
    # - User 5 time: <30s
    # - Average: <20s
    # - Post-survey: >80% report "easy to use"

  @performance @csf1 @automated
  Scenario: Automated performance benchmark for frictionless entry
    Given I am using a performance testing tool (Playwright or Puppeteer)
    And I have configured realistic network conditions (3G/4G)

    When I execute an automated user flow 10 times:
      | step                        | expected_duration |
      | Load app homepage           | <2s               |
      | Click Experimental tab      | <1s               |
      | Standards library loads     | <2s               |
      | Click "Autumn Leaves"       | <1s               |
      | Detail page loads           | <2s               |
      | Click "Generate Lines"      | <1s               |
      | API responds with lines     | <3s               |
      | ABC notation renders        | <1s               |

    Then I should measure total time for each iteration
    And 95% of iterations should complete in less than 30 seconds
    And the median (p50) should be less than 15 seconds
    And I should identify any bottlenecks (slowest step)

    # Quantitative Acceptance Criteria:
    # - p95 total time: <30s
    # - p50 total time: <15s
    # - Bottleneck identified: (e.g., "API response 3s is slowest")

  # ===========================================================================
  # CSF 2: FAST GENERATION (<3 seconds p95)
  # ===========================================================================
  # Target: POST /barry-harris/generate-instructions responds in <3s (p95)
  # Measurement: Load testing with 100+ requests
  # Success: 95% of requests complete in <3 seconds

  @performance @csf2 @load_test
  Scenario: Validate line generation API latency under load
    Given I am using a load testing tool (k6, Artillery, or ab)
    And I have prepared 10 different chord progressions from standards
    And I am targeting the production API endpoint

    When I send 100 requests over 1 minute (spread evenly)
    And each request uses a different standard's chord progression
    And each request uses a random CAGED shape (C, A, G, E, D)

    Then I should measure response time for each request
    And I should calculate p50, p90, p95, p99 latency percentiles

    And the results should meet these criteria:
      | percentile | target   |
      | p50        | <1s      |
      | p90        | <2s      |
      | p95        | <3s      |
      | p99        | <5s      |

    And 95% of requests should complete successfully (200 OK)
    And error rate should be less than 1%

    # Quantitative Acceptance Criteria:
    # - p95 latency: <3s
    # - Success rate: >95%
    # - Error rate: <1%
    # - No 5xx errors

  @performance @csf2 @cold_start
  Scenario: Validate line generation cold start performance
    Given the Cloudflare Worker has been idle for 10 minutes (cold start)
    And I have prepared a test request for "Autumn Leaves" with E shape

    When I send the first request after cold start
    Then I should measure the response time
    And the cold start request should complete in less than 5 seconds
    And subsequent requests (warm) should complete in less than 3 seconds

    When I repeat this test 10 times (10 cold starts)
    Then 90% of cold starts should complete in less than 5 seconds
    And I should identify if cold starts are a CSF blocker

    # Quantitative Acceptance Criteria:
    # - Cold start p90: <5s
    # - Warm requests p95: <3s
    # - Decision: If cold starts fail, implement pre-warming (health check every 5min)

  # ===========================================================================
  # CSF 5: EFFORTLESS SHAPE EXPLORATION (<3 seconds)
  # ===========================================================================
  # Target: Shape switch (API call + render) completes in <3s
  # Measurement: Frontend RUM (Real User Monitoring) + automated tests
  # Success: 95% of shape switches complete in <3 seconds

  @performance @csf5 @frontend
  Scenario: Validate shape switch latency from user perspective
    Given I am using a frontend performance testing tool (Playwright)
    And I have navigated to "Autumn Leaves" detail page
    And I have generated lines with E shape (initial state)

    When I click the A shape button
    And I measure time from click to new ABC notation rendered
    Then the total time should be less than 3 seconds

    When I repeat this for all shape transitions:
      | from_shape | to_shape |
      | E          | A        |
      | A          | G        |
      | G          | C        |
      | C          | D        |
      | D          | E        |

    Then I should measure each transition time
    And 100% of transitions should complete in less than 3 seconds
    And the median transition time should be less than 2 seconds

    # Quantitative Acceptance Criteria:
    # - All transitions: <3s
    # - Median: <2s
    # - Visual feedback: Loading indicator appears within 100ms

  @performance @csf5 @rum
  Scenario: Validate shape exploration with Real User Monitoring
    Given I have instrumented the frontend with performance tracking
    And I am using the Browser Performance API to measure:
      | metric                        |
      | Time from shape click         |
      | Time to API response received |
      | Time to ABC notation rendered |

    When I collect RUM data from 50 real user sessions
    And I filter for shape switch events only

    Then I should calculate p95 latency for each metric
    And the results should meet these criteria:
      | metric                 | p95_target |
      | Click to API response  | <2s        |
      | API response to render | <1s        |
      | Total (click to render)| <3s        |

    And I should identify any outliers (users with >5s latency)
    And I should investigate root cause (network, device, browser)

    # Quantitative Acceptance Criteria:
    # - p95 total latency: <3s
    # - p95 API latency: <2s
    # - p95 render latency: <1s
    # - Outlier investigation: Documented if >5% of users exceed 5s

  # ===========================================================================
  # ADDITIONAL PERFORMANCE METRICS (Non-CSF but important)
  # ===========================================================================

  @performance @standards_load
  Scenario: Validate standards library load time
    Given the standards library endpoint is cached at CDN edge
    And I am testing both cache HIT and cache MISS scenarios

    When I make 10 requests with cache purged (MISS)
    Then the p95 response time should be less than 500ms
    And I should verify data is compiled into WASM (no file I/O)

    When I make 100 requests with cache enabled (HIT)
    Then the p95 response time should be less than 100ms
    And I should verify cache hit ratio is >95%

    # Quantitative Acceptance Criteria:
    # - Cache MISS p95: <500ms
    # - Cache HIT p95: <100ms
    # - Cache hit ratio: >95%

  @performance @frontend_bundle
  Scenario: Validate frontend bundle size and load time
    Given the frontend is deployed to Cloudflare Pages
    And I am using Lighthouse performance audit

    When I run Lighthouse against "https://harrisjazzlines.com"
    Then I should measure:
      | metric                   | target |
      | First Contentful Paint   | <2s    |
      | Time to Interactive      | <3s    |
      | Total Bundle Size (gzip) | <250KB |
      | Lighthouse Score         | >90    |

    And I should verify lazy loading is enabled for Experimental tab
    And I should verify ABC.js library is code-split

    # Quantitative Acceptance Criteria:
    # - FCP: <2s
    # - TTI: <3s
    # - Bundle: <250KB
    # - Lighthouse: >90/100

  @performance @rate_limiting
  Scenario: Validate rate limiting thresholds
    Given rate limiting is configured per DEVOPS specifications:
      | endpoint                       | limit       |
      | GET /jazz-standards            | 100 req/min |
      | POST /barry-harris/generate    | 20 req/min  |

    When I send 100 requests to GET /jazz-standards in 1 minute
    Then all 100 requests should succeed (200 OK)

    When I send 101st request
    Then I should receive 429 Too Many Requests

    When I send 20 requests to POST /barry-harris/generate in 1 minute
    Then all 20 requests should succeed (200 OK)

    When I send 21st request
    Then I should receive 429 Too Many Requests

    # Quantitative Acceptance Criteria:
    # - Standards endpoint: 100/min enforced
    # - Line generation endpoint: 20/min enforced
    # - 429 response includes Retry-After header

  # ===========================================================================
  # PERFORMANCE TEST EXECUTION PLAN
  # ===========================================================================
  #
  # Test Environment: Production-like staging environment
  # - Backend: Cloudflare Workers (same config as production)
  # - Frontend: Cloudflare Pages (same config as production)
  # - CDN: Cloudflare CDN with caching enabled
  # - Network: Realistic latency (50-200ms)
  #
  # Test Tools:
  # - Load testing: k6 or Artillery (backend API)
  # - Frontend testing: Playwright (user flows)
  # - RUM: Browser Performance API + custom analytics
  # - Monitoring: Cloudflare Workers Analytics
  #
  # Test Data:
  # - Use all 15 jazz standards for variety
  # - Rotate through all 5 CAGED shapes
  # - Simulate realistic user behavior (think time between actions)
  #
  # Success Criteria Summary:
  # - CSF 1 (Frictionless Entry): 100% users <30s
  # - CSF 2 (Fast Generation): p95 <3s
  # - CSF 5 (Shape Exploration): p95 <3s
  # - Error rate: <1%
  # - Cache hit ratio: >95%
  # - Rate limiting: Enforced as configured
  #
  # Failure Mitigation:
  # - If CSF 2 fails: Investigate cold starts, consider pre-warming
  # - If CSF 5 fails: Optimize frontend rendering, consider skeleton screens
  # - If bundle size fails: Optimize code splitting, remove unused dependencies
  # - If rate limits are hit: Adjust thresholds or improve frontend caching
