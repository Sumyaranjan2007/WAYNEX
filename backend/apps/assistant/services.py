"""
AI Assistant services for WAYNEX.
GeminiService wraps Google Gemini API for intelligent travel assistance.
"""
import logging
import os
import time
from typing import Dict, List, Optional, Any
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Service wrapper for Google Gemini API.
    Provides travel intelligence, conversational recommendations, itinerary generation,
    and group travel assistant features for WAYNEX.
    Handles missing or invalid API keys gracefully with context-aware fallback.
    """

    DEFAULT_SYSTEM_INSTRUCTION = (
        "You are WAYNEX, an expert AI travel guide and itinerary planner specializing in India. "
        "You provide accurate, culturally rich, safe, and practical travel recommendations. "
        "Cover transportation (buses, trains, local transport), budget optimization in Indian Rupees (₹), "
        "local cuisine, cultural etiquette, safety tips, best seasons to visit, and hidden gems across all Indian states and UTs."
    )

    PREFERRED_MODELS = [
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
    ]

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')
        self._model = None
        self._model_name = None
        self._is_configured = False
        self._initialize()

    def _initialize(self):
        """Initialize the Gemini client if API key is provided and library is available."""
        if not self.api_key:
            logger.info("GeminiService initialized without API key. Operating in offline/fallback mode.")
            return

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)

            # Try preferred models in order of efficiency and quota
            for model_name in self.PREFERRED_MODELS:
                try:
                    self._model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=self.DEFAULT_SYSTEM_INSTRUCTION,
                    )
                    self._model_name = model_name
                    self._is_configured = True
                    logger.info(f"GeminiService configured successfully with model: {model_name}")
                    break
                except Exception as me:
                    logger.warning(f"Could not initialize model {model_name}: {me}")
                    continue

        except ImportError:
            logger.warning("google-generativeai package not installed. GeminiService in fallback mode.")
            self._is_configured = False
        except Exception as e:
            logger.error(f"Error configuring GeminiService: {e}")
            self._is_configured = False

    @property
    def is_available(self) -> bool:
        """Check if live Gemini API is configured and available."""
        return self._is_configured and self._model is not None

    def test_connection(self) -> Dict[str, Any]:
        """Test the live connection to Google Gemini API."""
        if not self.api_key:
            return {
                'success': False,
                'status': 'error',
                'message': 'GEMINI_API_KEY is not configured in backend environment.',
                'api_configured': False,
            }

        if not self.is_available:
            return {
                'success': False,
                'status': 'error',
                'message': 'GeminiService could not be initialized with available models.',
                'api_configured': True,
            }

        start_time = time.time()
        try:
            response = self._model.generate_content("Reply with: 'WAYNEX Gemini Live Service Operational'")
            latency_ms = round((time.time() - start_time) * 1000, 2)
            return {
                'success': True,
                'status': 'connected',
                'model': self._model_name,
                'latency_ms': latency_ms,
                'response': response.text.strip(),
                'api_configured': True,
                'message': f'Gemini API connection verified successfully using {self._model_name}.',
            }
        except Exception as e:
            return {
                'success': False,
                'status': 'api_error',
                'error': str(e),
                'model': self._model_name,
                'api_configured': True,
                'message': f'Gemini API returned an error: {e}',
            }

    def chat(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Conduct a multi-turn chat with the travel assistant.
        """
        if not message or not message.strip():
            return {
                'success': False,
                'response': "Please provide a valid question or travel query.",
                'mode': 'offline',
            }

        if self.is_available:
            try:
                gemini_history = []
                if history:
                    for h in history:
                        role = 'user' if h.get('role') == 'user' else 'model'
                        content = h.get('parts', '') or h.get('content', '')
                        if content:
                            gemini_history.append({'role': role, 'parts': [content]})

                chat_session = self._model.start_chat(history=gemini_history)
                response = chat_session.send_message(message)
                return {
                    'success': True,
                    'response': response.text,
                    'mode': 'gemini-live',
                    'model': self._model_name,
                }
            except Exception as e:
                logger.error(f"Gemini API chat error: {e}")
                return self._fallback_chat(message, error_note=str(e))

        return self._fallback_chat(message)

    def get_recommendations(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get structured travel recommendations based on user prompt and context."""
        full_prompt = prompt
        if context:
            ctx_str = "\n".join([f"- {k}: {v}" for k, v in context.items() if v])
            full_prompt = f"Context:\n{ctx_str}\n\nUser Request: {prompt}"

        if self.is_available:
            try:
                response = self._model.generate_content(
                    f"Provide clear, actionable travel recommendations for India based on this request:\n{full_prompt}"
                )
                return {
                    'success': True,
                    'recommendations': response.text,
                    'mode': 'gemini-live',
                    'model': self._model_name,
                }
            except Exception as e:
                logger.error(f"Gemini API recommendations error: {e}")
                return self._fallback_recommendations(prompt, context, error_note=str(e))

        return self._fallback_recommendations(prompt, context)

    def generate_itinerary(
        self,
        destination: str,
        num_days: int = 3,
        budget: Optional[float] = None,
        travel_style: str = 'balanced',
        attractions: Optional[List[str]] = None,
        departure_city: str = 'Bengaluru',
    ) -> Dict[str, Any]:
        """Generate a complete day-by-day itinerary using Gemini."""
        prompt = (
            f"Generate a detailed {num_days}-day travel itinerary for {destination}, India.\n"
            f"Departure city: {departure_city}\n"
            f"Travel style: {travel_style}\n"
        )
        if budget:
            prompt += f"Total budget per person: ₹{budget:,.0f}\n"
        if attractions:
            prompt += f"Selected places to visit: {', '.join(attractions)}\n"

        prompt += (
            "Structure your response with:\n"
            "1. Day-by-day hourly schedule (Morning, Afternoon, Evening)\n"
            "2. Recommended local food and authentic eateries\n"
            "3. Transportation advice between stops\n"
            "4. Budget estimation breakdown\n"
            "5. Practical safety and travel tips"
        )

        if self.is_available:
            try:
                response = self._model.generate_content(prompt)
                return {
                    'success': True,
                    'itinerary': response.text,
                    'destination': destination,
                    'days': num_days,
                    'mode': 'gemini-live',
                    'model': self._model_name,
                }
            except Exception as e:
                logger.error(f"Gemini API itinerary generation error: {e}")

        # Fallback response
        return {
            'success': True,
            'itinerary': (
                f"### {num_days}-Day Curated Journey in {destination}\n\n"
                f"**Day 1:** Arrival from {departure_city}. Check in and explore local markets and heritage sites.\n"
                f"**Day 2:** Full-day exploration of core attractions ({', '.join(attractions[:3]) if attractions else 'key landmarks'}).\n"
                f"**Day 3:** Scenic sunrise viewpoint, souvenir shopping, and return journey."
            ),
            'destination': destination,
            'days': num_days,
            'mode': 'offline-fallback',
        }

    def room_assistant(
        self,
        room_name: str,
        destination: str,
        user_query: str,
        group_context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Answer queries inside a WAYNEX Connect group travel room."""
        prompt = (
            f"You are the WAYNEX AI Assistant inside a collaborative travel group room.\n"
            f"Room Name: '{room_name}'\n"
            f"Destination: {destination}\n"
        )
        if group_context:
            prompt += f"Group Context: {group_context}\n"
        prompt += f"Group Member Question: {user_query}\n\nProvide a concise, friendly, and practical answer for the group."

        if self.is_available:
            try:
                response = self._model.generate_content(prompt)
                return {
                    'success': True,
                    'response': response.text,
                    'mode': 'gemini-live',
                    'model': self._model_name,
                }
            except Exception as e:
                logger.error(f"Gemini room assistant error: {e}")

        return self._fallback_chat(user_query)

    def _fallback_chat(self, message: str, error_note: Optional[str] = None) -> Dict[str, Any]:
        """Intelligent rule-based travel assistant responses when API key is missing or quota limited."""
        msg_lower = message.lower()
        reply_lines = []

        if 'karnataka' in msg_lower or 'bangalore' in msg_lower or 'bengaluru' in msg_lower:
            reply_lines.append(
                "Karnataka offers an incredible blend of heritage, nature, and technology. "
                "Top highlights include Bengaluru (Silicon Valley of India, Lalbagh, Cubbon Park), "
                "Mysuru (Mysore Palace, Chamundi Hills, Dasara celebrations), "
                "Hampi (UNESCO World Heritage Vijayanagara ruins), and Coorg (coffee estates and Abbey Falls)."
            )
        elif 'hampi' in msg_lower:
            reply_lines.append(
                "Hampi is a UNESCO World Heritage site featuring the majestic ruins of the 14th-century Vijayanagara Empire. "
                "Key spots: Virupaksha Temple, Stone Chariot at Vijaya Vittala Temple, and Matanga Hill for sunrise. "
                "Best visited between October and February when the weather is pleasant."
            )
        elif 'budget' in msg_lower:
            reply_lines.append(
                "For budget travel in India: utilize KSRTC and Indian Railways for affordable intercity transport. "
                "Stay in verified homestays and hostels (ranging ₹500 - ₹1,500/night). "
                "Enjoy authentic local thalis and street food for ₹100 - ₹300/meal."
            )
        elif 'safety' in msg_lower or 'emergency' in msg_lower:
            reply_lines.append(
                "WAYNEX Safety Advisory: Always keep trusted emergency contacts updated in your profile. "
                "The national emergency helpline in India is 112 (Police: 100, Ambulance: 108, Women Helpline: 1091). "
                "WAYNEX provides real-time location sharing and SOS check-ins."
            )
        else:
            reply_lines.append(
                f"Regarding '{message.strip()}': India offers diverse experiences across 28 states and 8 union territories. "
                "You can explore destinations in Karnataka, Himachal Pradesh, Kerala, Rajasthan, and beyond. "
                "WAYNEX provides verified transit routes, safety ratings, and budget optimization for your journey."
            )

        return {
            'success': True,
            'response': "\n\n".join(reply_lines),
            'mode': 'offline-fallback',
            'api_configured': bool(self.api_key),
            'note': error_note,
        }

    def _fallback_recommendations(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        error_note: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Provide structured travel recommendations in offline mode."""
        return {
            'success': True,
            'recommendations': (
                "WAYNEX Recommended Itinerary:\n"
                "1. Day 1: Arrive, check into homestay, visit landmark temple & walking tour.\n"
                "2. Day 2: Nature trail, sunset point, and local food market exploration.\n"
                "3. Day 3: Heritage architecture, artisan shopping, and evening return transit."
            ),
            'context_considered': context or {},
            'mode': 'offline-fallback',
            'api_configured': bool(self.api_key),
            'note': error_note,
        }
